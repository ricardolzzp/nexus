from flask import Flask, request, Response
import json
import os
import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuração do banco de dados PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo da tabela
class NexdistDfe(db.Model):
    __tablename__ = 'novaconsulting_nexdistdfe'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=lambda: str(uuid.uuid4()))
    file = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    tenant_id = db.Column(db.String(50), nullable=False)

# Criação da tabela se não existir
with app.app_context():
    db.create_all()

# Diretório onde os arquivos XML serão salvos
SAVE_DIR = "xml_files"
os.makedirs(SAVE_DIR, exist_ok=True)

@app.route("/odata/v4/nf", methods=["POST"])
def upload_xml():
    tenant_id = request.args.get("tenant_id")
    
    if not tenant_id:
        return Response(json.dumps({"error": "Missing tenant_id in headers"}), status=400, mimetype='application/json')
    if request.content_type != "application/xml":
        return Response(json.dumps({"error": "Invalid content type. Expected application/xml"}), status=400, mimetype='application/json')
    
    xml_data = request.data
    
    if not xml_data:
        return Response(json.dumps({"error": "Empty XML payload"}), status=400, mimetype='application/json')
    
    # Gera um nome de arquivo único com timestamp
    filename = f"xml_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xml"
    filepath = os.path.join(SAVE_DIR, filename)
    
    with open(filepath, "wb") as file:
        file.write(xml_data)
    
    # Salva no banco de dados
    # new_record = NexdistDfe(file=filepath, status="PENDING", tenant_id=tenant_id)
    # db.session.add(new_record)
    # db.session.commit()

    try:
        new_record = NexdistDfe(file=filepath, status="PENDING", tenant_id=tenant_id)
        db.session.add(new_record)
        db.session.commit()
        print("Registro salvo com sucesso!")
    except Exception as e:
        db.session.rollback()  # Reverte alterações em caso de erro
        print(f"Erro ao salvar no banco: {e}")

    
    return Response(json.dumps({"message": f"XML saved as {filename} and recorded in database"}), status=200, mimetype='application/json')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
