# Etapa de construção
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia os arquivos de configuração e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o resto do código e compila a versão final
COPY . ./
RUN dotnet publish -c Release -o out

# Etapa de execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Configura a porta que o Render exige
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Inicia a API (Certifique-se de que o nome da DLL corresponde ao seu projeto)
ENTRYPOINT ["dotnet", "KorzelVTT.Api.dll"]