# Define a versão do node.js usada
FROM node:22

# Define o diretório de trabalho do container
WORKDIR /app

# Copia o package.json (dependências) para a raiz
COPY package.json .

# Roda o npm install para instalar os pacotes
RUN npm install                                 
# RUN é usado para executar comandos na construção da imagem


# Copia o restante dos arquivos da raiz
COPY . .

# Expõe a porta usada pela app pra uso
EXPOSE 3000

# Define o comando para inicialização
CMD [ "npm", "start" ]
# CMD é para definir um comando a ser usado com a imagem pronta, só podemos usar 1