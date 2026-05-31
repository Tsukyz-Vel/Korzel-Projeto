# Etapa de construção (Agora usando o .NET 10.0)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copia os arquivos de configuração e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o resto do código e compila a versão final
COPY . ./
RUN dotnet publish -c Release -o out

# Etapa de execução (Agora usando o .NET 10.0)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Configura a porta que o Render exige
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Inicia a API
ENTRYPOINT ["dotnet", "KorzelVTT.Api.dll"]