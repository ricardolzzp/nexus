import time
import uuid
import requests
from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from lxml import etree  # Para manipulação de XML
from pynfe.processamento.comunicacao import ComunicacaoSefaz
from pynfe.entidades.certificado import CertificadoA1
from pynfe.utils.webservices import NFE

app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo da tabela
class NexdistDfe(db.Model):
    __tablename__ = 'novaconsulting_nexdistdfe'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    file = db.Column(db.String(255), nullable=False)  # Presumindo que seja o caminho para o arquivo XML
    status = db.Column(db.String(50), nullable=False)
    tenant_id = db.Column(db.String(50), nullable=False)

# Função para ler os registros com status 'pendente' e atualizar para 'enviado'
def read_and_update_pending_records():
    # Realiza a consulta para buscar registros com status 'pendente'
    pending_records = NexdistDfe.query.filter(NexdistDfe.status == 'PENDING').order_by(NexdistDfe.id.asc()).first()

    return pending_records

def post_header():
    response = {
        "content-type": "application/soap+xml; charset=utf-8;",
        "Accept": "application/soap+xml; charset=utf-8;",
    }
    return response


def get_url(uf, homologacao, modelo, consulta, contingencia=False):
    url = ''
    _ambiente = 2 if homologacao else 1

    """Retorna a url para comunicação com o webservice"""
    if contingencia:
        contingencia_svrs = ["AM", "BA", "CE", "GO", "MA", "MS", "MT", "PE", "PR"]
        contingencia_svan = [
            "AC",
            "AL",
            "AP",
            "DF",
            "ES",
            "MG",
            "PA",
            "PB",
            "PI",
            "RJ",
            "RN",
            "RO",
            "RR",
            "RS",
            "SC",
            "SE",
            "SP",
            "TO",
        ]

        if uf.upper() in contingencia_svrs:
            if _ambiente == 1:
                ambiente = "HTTPS"
            else:
                ambiente = "HOMOLOGACAO"
            if modelo == "nfe":
                # nfe Ex: https://nfe.fazenda.pr.gov.br/nfe/NFeStatusServico3
                url = NFE["SVRS"][ambiente] + NFE["SVRS"][consulta]
            else:
                raise Exception(
                    'Modelo não encontrado! Defina modelo="nfe" ou "nfce"'
                )
        elif uf.upper() in contingencia_svan:
            if _ambiente == 1:
                ambiente = "HTTPS"
            else:
                ambiente = "HOMOLOGACAO"
            if modelo == "nfe":
                # nfe Ex: https://nfe.fazenda.pr.gov.br/nfe/NFeStatusServico3
                url = NFE["SVAN"][ambiente] + NFE["SVAN"][consulta]
            else:
                raise Exception(
                    'Modelo não encontrado! Defina modelo="nfe" ou "nfce"'
                )
        return url

    # estado que implementam webservices proprios
    lista = ["PR", "MS", "SP", "AM", "CE", "BA", "GO", "MG", "MT", "PE", "RS"]
    if uf.upper() in lista:
        if _ambiente == 1:
            ambiente = "HTTPS"
        else:
            ambiente = "HOMOLOGACAO"
        if modelo == "nfe":
            # CE é a única UF que possuem NFE SVRS e NFCe próprio
            if uf.upper() == "CE":
                url = NFE["SVRS"][ambiente] + NFE["SVRS"][consulta]
            else:
                # nfe Ex: https://nfe.fazenda.pr.gov.br/nfe/NFeStatusServico3
                url = (
                    NFE[uf.upper()][ambiente] + NFE[uf.upper()][consulta]
                )
        else:
            raise Exception('Modelo não encontrado! Defina modelo="nfe" ou "nfce"')
    # Estados que utilizam outros ambientes
    else:
        lista_svrs = [
            "AC",
            "AL",
            "AP",
            "DF",
            "ES",
            "PB",
            "PI",
            "RJ",
            "RN",
            "RO",
            "RR",
            "SC",
            "SE",
            "TO",
            "PA",
        ]
        if uf.upper() in lista_svrs:
            if _ambiente == 1:
                ambiente = "HTTPS"
            else:
                ambiente = "HOMOLOGACAO"
            if modelo == "nfe":
                # nfe Ex: https://nfe.fazenda.pr.gov.br/nfe/NFeStatusServico3
                url = NFE["SVRS"][ambiente] + NFE["SVRS"][consulta]
            else:
                raise Exception(
                    'Modelo não encontrado! Defina modelo="nfe" ou "nfce"'
                )
        # unico UF que utiliza SVAN ainda para NF-e
        # SVRS para NFC-e
        elif uf.upper() == "MA":
            if _ambiente == 1:
                ambiente = "HTTPS"
            else:
                ambiente = "HOMOLOGACAO"
            if modelo == "nfe":
                # nfe Ex: https://nfe.fazenda.pr.gov.br/nfe/NFeStatusServico3
                url = NFE["SVAN"][ambiente] + NFE["SVAN"][consulta]
            else:
                raise Exception(
                    'Modelo não encontrado! Defina modelo="nfe" ou "nfce"'
                )
        else:
            raise Exception(
                f"Url não encontrada para {modelo} e {consulta} {uf.upper()}"
            )
    return url

# Função para monitorar os novos registros na tabela
def monitor_new_records():
    while True:
        with app.app_context():  # Garante que você esteja dentro do contexto do Flask
            # Atualiza os registros pendentes para 'enviado' e pega os registros atualizados
            record = read_and_update_pending_records()

        if record:
            print(f"Processando Registro ID: {record.id} | Arquivo: {record.file} | Status: {record.status}")
            
            # Configurações da comunicação com a SEFAZ
            uf = 'PR'  # Substitua pelo estado correto
            certificado = './certificado.pfx'  # Caminho para o certificado
            senha = '123'  # Senha do certificado
            homologacao = True  # True para homologação, False para produção

            try:
                # Carrega o XML do arquivo como bytes
                with open(record.file, 'rb') as file:
                    xml_content = file.read()

                # Convertendo o conteúdo XML para um objeto etree.Element
                nota_fiscal = etree.fromstring(xml_content)

                url = get_url( uf=uf, homologacao = homologacao, modelo='nfe', consulta="AUTORIZACAO", contingencia=False )

                certificado_a1 = CertificadoA1(certificado)
                chave, cert = certificado_a1.separar_arquivo(
                    senha, caminho=True
                )

                chave_cert = (cert, chave)
                
                try:
                   
                    result = requests.post(
                        url, nota_fiscal, headers=post_header(), cert=chave_cert, verify=False
                    )

                    result.encoding = "utf-8"
                    return result
                except requests.exceptions.RequestException as e:
                    raise e
                finally:
                    certificado_a1.excluir()

                # # Trata o retorno e atualiza o status
                # if retorno == 0:
                #     print(f"Autorização bem-sucedida para ID {record.id}")
                #     record.status = 'ENVIADO'
                #     db.session.commit()  # Salva a alteração no banco de dados
                # else:
                #     print(f"Erro na autorização para ID {record.id}: {resultado}")

            except Exception as e:
                print(f"Erro ao processar o XML para ID {record.id}: {str(e)}")

        # if pending_records:
        #     for record in pending_records:
        #         print(f"Processando Registro ID: {record.id} | Arquivo: {record.file} | Status: {record.status}")
                
        #         # Aqui, você chama a comunicação com a SEFAZ para cada registro
        #         uf = 'PR'  # Substitua pelo valor adequado
        #         certificado = './certificado.pfx'  # Substitua pelo caminho do certificado
        #         senha = '123'  # Substitua pela senha do certificado
        #         homologacao = True  # ou False, dependendo do ambiente

        #         # Carrega o XML do arquivo como bytes
        #         try:
        #             with open(record.file, 'rb') as file:
        #                 xml_content = file.read()  # Lê o arquivo como bytes

        #             # Convertendo o conteúdo XML para um objeto etree.Element
        #             nota_fiscal = etree.fromstring(xml_content)

        #             # Cria a instância e chama o método de autorização
        #             con = ComunicacaoSefaz(uf, certificado, senha, homologacao)
        #             retorno, resultado = con.autorizacao(modelo='nfe', nota_fiscal=nota_fiscal)

        #             # xml = con.status_servico('nfe')     # nfe ou nfce
        #             # print (xml.text)
        #             # Trata o retorno e imprime o resultado
        #             if retorno == 0:
        #                 print(f"Autorização bem-sucedida: {resultado}")
                        
        #                 # Atualiza o status para 'enviado'
        #                 record.status = 'enviado'
        #                 db.session.commit()  # Commit para salvar as alterações no banco de dados
        #             else:
        #                 print(f"Erro na autorização: {resultado}")
                
        #         except Exception as e:
        #             print(f"Erro ao processar o XML para o registro ID {record.id}: {str(e)}")

        time.sleep(20)  # Intervalo entre as verificações (5 segundos)

if __name__ == "__main__":
    # Começar a monitorar os novos registros após iniciar o Flask
    monitor_new_records()
