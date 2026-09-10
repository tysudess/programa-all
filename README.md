# Programa All — Windows

Aplicativo unificado para reunir os programas Windows do ecossistema `tysudess` em uma única experiência de uso e em um único processo de distribuição.

## Módulos incluídos

- Monitor de Notícias — `tysudess/noticias-monitor`
- Extrator de Vídeos — Download — `tysudess/extrator-video-windows`
- Extrator de Vídeos — Editor / Timeline — `tysudess/extrator-video-windows`
- Extrator de Notícias — `tysudess/Extrator-de-noticias-windows`
- Automação de Planilhas — `tysudess/automa-o-planilhas`
- Editor de PDF — `tysudess/EditorPDF-Windows-v0.1-PROJETO1`
- Principais Capas — `tysudess/capas-windows-portable`

## Estratégia de integração

O `programa-all` funciona como a camada única de navegação e distribuição. Cada módulo continua usando o próprio motor original para preservar as funcionalidades existentes. O build do GitHub Actions clona e compila as versões atuais de cada repositório e coloca os executáveis dentro do pacote final.

Essa abordagem evita reimplementar ferramentas maduras em outra linguagem apenas para unificá-las visualmente, reduzindo o risco de regressões.

## Interface

A aplicação principal possui uma barra lateral única com os módulos. O Extrator de Vídeos aparece dividido em duas entradas: **Download** e **Editor / Timeline**.

## Build

O workflow `.github/workflows/build-windows-all.yml` gera a distribuição Windows e publica um artefato `ProgramaAll-Windows`.

> Os seis repositórios originais permanecem independentes e não são alterados por este projeto.
