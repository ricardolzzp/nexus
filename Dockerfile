
# Etapa 1: Construção da aplicação
FROM node:18-alpine AS builder

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos de dependências para o container
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do projeto para o diretório de trabalho no container
COPY . .

# Etapa 2: Configuração da imagem final
FROM node:18-alpine

# # Construir a aplicação (se necessário)
RUN npm install --global @sap/cds-dk

# Definir o diretório de t rabalho na imagem final
WORKDIR /usr/src/app

# Copiar os arquivos gerados na etapa de construção
COPY --from=builder /usr/src/app .

# Expor a porta 80 para o container
EXPOSE 4004

# Variável de ambiente para configurar a porta de execução
ENV PORT=4004

# Comando para iniciar a aplicação CAP
CMD ["npm", "start"]
