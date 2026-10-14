# Proposta audiovisual para a FSB Holding

Implementação local na base existente de Next.js 16, React, TypeScript e Tailwind. Nenhuma dependência adicionada. Não publicada.

## Estrutura e decisões

- Fontes locais DM Sans e Degular, logotipo autoral, acento roxo e os 100 frames da apresentação original preservados.
- Hero ligado ao scroll, com frame estático e sem carregamento da sequência para movimento reduzido.
- Página comercial em português, com contexto FSB, portfólio, apresentação profissional, escopo, investimento, processo, condições e próximos passos.
- Blog, artigos, traduções do blog, componentes e rotas de cases de produto removidos. Mídias utilizadas migradas para `public/videos/clint`.
- Metadados e imagem social adaptados. Indexação desabilitada para esta proposta; isso não constitui controle de acesso.
- Contato confirmado no currículo: jhoncamiloux@gmail.com. Nenhum WhatsApp inventado.
- 14 × R$ 340,00 = R$ 4.760,00. Duas rodadas de ajustes por vídeo, dentro do roteiro e escopo.

## Arquivos principais

- `app/page.tsx`: narrativa e condições comerciais.
- `app/proposal.css`: layout editorial e responsividade.
- `components/video-gallery.tsx`: seleção, reprodução, pausa e download das seis peças.
- `components/sections/hero-canvas.tsx`: apresentação animada reaproveitada.
- `app/layout.tsx`, `app/opengraph-image.tsx`, `app/manifest.ts`, `app/robots.ts`: identidade e metadados.
- `.env.example`: URL pública a configurar antes da publicação.

## Materiais e fontes

Currículo lido: `public/Camilo-Rios-Product-Designer-2025.docx`. Formação, ferramentas, empresas e contato extraídos desse arquivo. A referência de aproximadamente oito anos segue o briefing e o período do currículo de 2025; revisar se desejar atualizar essa contagem.

As seis peças são de um único carrossel da Clint, produzido para tutoriais de motion com apoio de IA. O contexto foi identificado no código original `lib/blog/posts-tutoriais.ts` antes da remoção. Não foram apresentadas como seis clientes ou como entrevistas institucionais.

Referências consultadas:
- https://camilo-rios-portfolio.vercel.app/
- https://proposta-de-marca.lovable.app/
- https://fsbholding.com.br/sobre-nos
- https://www.fsbholding.com.br/noticias-e-artigos/fsb-holding-realiza-fusao-entre-ipri-e-fsb-inteligencia

O site da FSB depende de execução de JavaScript; o posicionamento foi corroborado pelo conteúdo institucional indexado. Não foram inferidos objetivos internos.

## Pendências antes de enviar ao cliente

1. Adicionar exemplos de edição institucional/entrevistas, se disponíveis. A página sinaliza a seleção a complementar.
2. Confirmar se a vinheta será fornecida ou se sua criação deverá ser negociada.
3. Alinhar formatos, resoluções, trilha/licenciamento, cronograma e condições de pagamento.
4. Definir a URL real da proposta em `NEXT_PUBLIC_SITE_URL` no ambiente de publicação.

## Executar

Na pasta do projeto: `npm run dev`. Para produção: `npm run build -- --webpack`, depois `npm start`. O build com webpack foi usado na validação porque a primeira execução do Turbopack não concluiu no disco externo. O script original foi preservado.

## Verificações

- Checagem TypeScript sem erros.
- Build de produção com webpack concluído.
- Página e MP4 respondem HTTP 200; `/blog` responde 404.
- Conferência de valores, todas as âncoras, seis MP4 e thumbnails, 100 frames do hero.
- Inspeção visual desktop e verificações responsivas em 390 e 768 pixels, sem overflow horizontal.
- Alternância de peças e reprodução/pausa pelo botão dedicado verificadas: vídeo carregado, tempo avançando e console sem erros.
- O acionamento automatizado do controle nativo de vídeo travou o navegador integrado durante a verificação. O botão dedicado foi adicionado e validado; os controles nativos permanecem para volume e tela cheia. Recomenda-se revisão final em Chrome/Safari antes do envio.
- Foco visível, link para pular navegação, botões com nomes acessíveis e suporte a movimento reduzido implementados. Não foi feita auditoria completa com leitor de tela.

Backup temporário dos fontes anteriores: `/private/tmp/fsb-original-backup/source.tar.gz` (não contém todo o diretório public).
