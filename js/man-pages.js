/**
 * Penguin Gym Linux - Banco Completo de Manuais (man pages & --help)
 * Documentação detalhada em português estilo MAN(1) para treinamento realista.
 */

const MAN_PAGES = {
  "man": {
    "section": "1",
    "short": "interface para os manuais de referência do sistema",
    "synopsis": "man [COMANDO]",
    "description": "O comando man formata e exibe as páginas do manual online de comandos, utilitários e funções do sistema Linux.",
    "options": [
      "-k, apropos  Busca páginas de manual por palavra-chave",
      "-f, whatis   Exibe uma descrição curta de uma linha sobre o comando"
    ],
    "examples": [
      "man ls        Exibe o manual do comando ls",
      "man grep      Exibe o manual do comando grep",
      "man chmod     Exibe o manual de permissões chmod"
    ]
  },
  "help": {
    "section": "1",
    "short": "exibe informações sobre comandos internos do shell (builtins) e lista de comandos",
    "synopsis": "help [COMANDO]",
    "description": "Exibe um resumo dos comandos internos do shell Bash e dos utilitários disponíveis no ambiente de treinamento Penguin Gym Linux. Se um COMANDO for especificado, mostra a ajuda detalhada daquele comando.",
    "options": [
      "Sem opções    Lista todas as categorias de comandos disponíveis",
      "[COMANDO]     Exibe a documentação detalhada do comando informado"
    ],
    "examples": [
      "help          Mostra o quadro geral de comandos",
      "help cd       Mostra como funciona o comando cd",
      "help alias    Mostra como criar apelidos de comandos"
    ]
  },
  "pwd": {
    "section": "1",
    "short": "imprime o nome do diretório de trabalho atual (Print Working Directory)",
    "synopsis": "pwd [-LP]",
    "description": "Exibe o caminho absoluto completo do diretório em que você está posicionado no momento.",
    "options": [
      "-L            Usa o caminho lógico do ambiente (mantém links simbólicos)",
      "-P            Evita todos os links simbólicos (mostra o caminho físico real)"
    ],
    "examples": [
      "pwd           Exibe por exemplo: /home/user"
    ]
  },
  "cd": {
    "section": "1",
    "short": "altera o diretório de trabalho atual do shell (Change Directory)",
    "synopsis": "cd [DIRETÓRIO]",
    "description": "Muda o diretório atual para DIRETÓRIO. Se nenhum diretório for informado, move para o diretório pessoal do usuário ($HOME, equivalente a ~). O argumento \"-\" move de volta para o diretório anterior ($OLDPWD).",
    "options": [
      "~             Diretório home do usuário (/home/user)",
      "..            Diretório pai (um nível acima)",
      ".             Diretório atual",
      "-             Retorna ao diretório visitado anteriormente"
    ],
    "examples": [
      "cd documents  Entra na pasta documents",
      "cd ..         Volta um nível acima",
      "cd ~          Retorna para /home/user",
      "cd -          Alterna para o diretório anterior"
    ]
  },
  "ls": {
    "section": "1",
    "short": "lista o conteúdo de diretórios",
    "synopsis": "ls [OPÇÕES]... [ARQUIVO]...",
    "description": "Lista informações sobre os arquivos e pastas (do diretório atual por padrão). Ordena as entradas alfabeticamente se nenhuma opção de ordenação for informada.",
    "options": [
      "-a, --all             Não ignora entradas que começam com ponto (.)",
      "-A, --almost-all      Lista ocultos, exceto \".\" e \"..\"",
      "-l                    Usa formato de listagem longa (permissões, dono, tamanho, data)",
      "-h, --human-readable  Com -l, imprime tamanhos em formato legível (ex: 1K, 24M, 2G)",
      "-R, --recursive       Lista subdiretórios recursivamente",
      "-r, --reverse         Inverte a ordem da classificação",
      "-t                    Ordena por data/hora de modificação (mais recentes primeiro)",
      "-S                    Ordena por tamanho do arquivo (maiores primeiro)",
      "-1                    Lista um arquivo por linha",
      "-F, --classify        Anexa indicador (/ para pastas, * para executáveis, @ para links)"
    ],
    "examples": [
      "ls            Lista arquivos visíveis do diretório atual",
      "ls -la        Lista todos os arquivos (incluindo ocultos) com detalhes",
      "ls -lh        Lista detalhes com tamanhos legíveis (K, M, G)"
    ]
  },
  "mkdir": {
    "section": "1",
    "short": "cria diretórios (Make Directories)",
    "synopsis": "mkdir [OPÇÕES]... DIRETÓRIO...",
    "description": "Cria o(s) DIRETÓRIO(s) caso ainda não existam.",
    "options": [
      "-p, --parents   Não emite erro se já existir e cria diretórios pais conforme necessário",
      "-v, --verbose   Imprime uma mensagem para cada diretório criado",
      "-m, --mode=MODO Define o modo de permissão do diretório (como no chmod)"
    ],
    "examples": [
      "mkdir myproject          Cria a pasta myproject",
      "mkdir -p a/b/c           Cria toda a árvore de pastas a/b/c de uma só vez"
    ]
  },
  "touch": {
    "section": "1",
    "short": "altera os horários do arquivo ou cria arquivos vazios",
    "synopsis": "touch [OPÇÕES]... ARQUIVO...",
    "description": "Atualiza os horários de acesso e modificação de cada ARQUIVO para a hora atual. Um argumento ARQUIVO que não exista é criado vazio.",
    "options": [
      "-a            Altera apenas o horário de acesso",
      "-m            Altera apenas o horário de modificação",
      "-c, --no-create Não cria nenhum arquivo caso não exista"
    ],
    "examples": [
      "touch test.txt           Cria um arquivo vazio chamado test.txt",
      "touch a.txt b.txt        Cria múltiplos arquivos simultaneamente"
    ]
  },
  "cat": {
    "section": "1",
    "short": "concatena arquivos e imprime na saída padrão",
    "synopsis": "cat [OPÇÕES]... [ARQUIVO]...",
    "description": "Concatena o conteúdo dos ARQUIVOS e exibe na tela (saída padrão). Sem ARQUIVO, lê da entrada padrão (stdin).",
    "options": [
      "-n, --number         Numera todas as linhas de saída começando em 1",
      "-b, --number-nonblank Numera apenas as linhas que não estão em branco",
      "-s, --squeeze-blank  Suprime linhas em branco repetidas"
    ],
    "examples": [
      "cat documents/readme.txt     Exibe o conteúdo de readme.txt",
      "cat -n documents/notes.txt   Exibe notes.txt com linhas numeradas"
    ]
  },
  "echo": {
    "section": "1",
    "short": "exibe uma linha de texto na saída padrão",
    "synopsis": "echo [OPÇÕES]... [TEXTO]...",
    "description": "Imprime os argumentos de TEXTO na saída padrão separados por espaço e seguidos por uma quebra de linha.",
    "options": [
      "-n            Não adiciona a quebra de linha final",
      "-e            Habilita a interpretação de sequências de escape (\\n, \\t)"
    ],
    "examples": [
      "echo \"Hello Linux\"               Imprime Hello Linux na tela",
      "echo \"Hello World\" > hello.txt   Grava o texto no arquivo hello.txt",
      "echo $USER                       Exibe o valor da variável USER"
    ]
  },
  "cp": {
    "section": "1",
    "short": "copia arquivos e diretórios (Copy)",
    "synopsis": "cp [OPÇÕES]... ORIGEM DESTINO",
    "description": "Copia a ORIGEM para o DESTINO, ou múltiplas ORIGENS para um diretório de DESTINO.",
    "options": [
      "-r, -R, --recursive  Copia diretórios e todo o seu conteúdo recursivamente",
      "-v, --verbose        Explica o que está sendo feito (mostra origem -> destino)",
      "-i, --interactive    Pergunta antes de sobrescrever"
    ],
    "examples": [
      "cp documents/readme.txt backup.txt      Cria uma cópia chamada backup.txt",
      "cp -r documents backup_docs             Copia a pasta documents inteira"
    ]
  },
  "mv": {
    "section": "1",
    "short": "move ou renomeia arquivos e diretórios (Move)",
    "synopsis": "mv [OPÇÕES]... ORIGEM DESTINO",
    "description": "Renomeia a ORIGEM para DESTINO, ou move a(s) ORIGEM(ns) para dentro de um diretório DESTINO.",
    "options": [
      "-v, --verbose        Mostra os arquivos à medida que são movidos",
      "-i, --interactive    Solicita confirmação antes de sobrescrever"
    ],
    "examples": [
      "mv projects/test.sh downloads           Move test.sh para a pasta downloads",
      "mv antigo.txt novo.txt                  Renomeia antigo.txt para novo.txt"
    ]
  },
  "rm": {
    "section": "1",
    "short": "remove arquivos ou diretórios (Remove)",
    "synopsis": "rm [OPÇÕES]... ARQUIVO...",
    "description": "Remove cada arquivo especificado. Por padrão, não remove diretórios a menos que -r ou -R seja informado.",
    "options": [
      "-r, -R, --recursive  Remove diretórios e seus conteúdos recursivamente",
      "-f, --force          Ignora arquivos inexistentes e nunca solicita confirmação",
      "-v, --verbose        Exibe mensagem para cada item removido"
    ],
    "examples": [
      "rm documents/notes.txt   Exclui o arquivo notes.txt",
      "rm -r downloads          Exclui a pasta downloads e seu conteúdo"
    ]
  },
  "rmdir": {
    "section": "1",
    "short": "remove diretórios vazios (Remove Directory)",
    "synopsis": "rmdir [OPÇÕES]... DIRETÓRIO...",
    "description": "Remove os DIRETÓRIOS especificados, somente se eles estiverem completamente vazios.",
    "options": [
      "-p, --parents   Remove o DIRETÓRIO e seus ancestrais se ficarem vazios",
      "-v, --verbose   Exibe diagnóstico para cada diretório processado"
    ],
    "examples": [
      "rmdir downloads          Remove o diretório vazio downloads"
    ]
  },
  "grep": {
    "section": "1",
    "short": "imprime linhas que correspondem a padrões (Global Regular Expression Print)",
    "synopsis": "grep [OPÇÕES]... PADRÃO [ARQUIVO]...",
    "description": "O grep procura pelo PADRÃO em cada ARQUIVO (ou na entrada padrão se nenhum arquivo for informado) e imprime cada linha que contiver correspondência.",
    "options": [
      "-i, --ignore-case    Ignora distinção entre maiúsculas e minúsculas",
      "-r, -R, --recursive  Lê todos os arquivos de cada diretório recursivamente",
      "-n, --line-number    Prefixa cada linha de saída com o número da linha no arquivo",
      "-v, --invert-match   Seleciona apenas as linhas que NÃO correspondem ao padrão",
      "-c, --count          Imprime apenas a contagem de linhas correspondentes",
      "-l, --files-with-matches Imprime apenas o nome dos arquivos com correspondência"
    ],
    "examples": [
      "grep Linux documents/readme.txt      Busca \"Linux\" em readme.txt",
      "grep -i linux documents/readme.txt   Busca sem diferenciar maiúsculas/minúsculas",
      "grep -r Linux documents              Busca recursivamente na pasta documents"
    ]
  },
  "find": {
    "section": "1",
    "short": "procura por arquivos em uma hierarquia de diretórios",
    "synopsis": "find [CAMINHO...] [EXPRESSÃO]",
    "description": "Pesquisa a árvore de diretórios a partir do CAMINHO informado (ou \".\" por padrão) avaliando a expressão de filtro e executando ações nos arquivos encontrados.",
    "options": [
      "-name PADRÃO         Filtra pelo nome base do arquivo (suporta curingas como \"*.txt\")",
      "-iname PADRÃO        Igual a -name, mas insensível a maiúsculas/minúsculas",
      "-type TIPO           Filtra pelo tipo: f (arquivo regular), d (diretório), l (link simbólico)",
      "-exec CMD {} \\;      Executa o comando CMD para cada arquivo encontrado ({} é substituído pelo caminho)"
    ],
    "examples": [
      "find . -name \"*.txt\"                         Encontra todos os arquivos .txt",
      "find . -type d -name projects                Encontra diretórios chamados projects",
      "find documents -name \"*.txt\" -exec cat {} \\; Exibe o conteúdo de todos os .txt em documents"
    ]
  },
  "chmod": {
    "section": "1",
    "short": "altera os bits de modo/permissão de arquivos (Change Mode)",
    "synopsis": "chmod [OPÇÕES]... MODO ARQUIVO...",
    "description": "Altera as permissões de acesso de cada ARQUIVO de acordo com o MODO, que pode ser uma representação simbólica (ex: u+x, +x, go-w) ou um número octal de 3 dígitos (ex: 755, 644, 600).",
    "options": [
      "-R, --recursive  Altera arquivos e diretórios recursivamente",
      "-v, --verbose    Exibe diagnóstico para cada arquivo processado"
    ],
    "examples": [
      "chmod +x test.txt        Adiciona permissão de execução ao arquivo test.txt",
      "chmod 755 script.sh      Define rwxr-xr-x (dono total, grupo/outros leitura e execução)",
      "chmod 644 readme.txt     Define rw-r--r-- (leitura/escrita para dono, leitura para outros)"
    ]
  },
  "chown": {
    "section": "1",
    "short": "altera o proprietário e o grupo de arquivos (Change Owner)",
    "synopsis": "sudo chown [OPÇÕES]... DONO[:GRUPO] ARQUIVO...",
    "description": "Altera o usuário e/ou grupo proprietário de cada ARQUIVO informado (requer privilégios de superusuário via sudo).",
    "options": [
      "-R, --recursive  Opera em arquivos e diretórios recursivamente",
      "-v, --verbose    Descreve cada alteração realizada"
    ],
    "examples": [
      "sudo chown admin test.txt    Muda o dono de test.txt para admin",
      "sudo chown root:root arq.txt Muda dono e grupo para root"
    ]
  },
  "sudo": {
    "section": "8",
    "short": "executa um comando como outro usuário (geralmente superusuário/root)",
    "synopsis": "sudo COMANDO [ARGUMENTOS]...",
    "description": "Permite que um usuário autorizado execute um comando com privilégios de administrador (root) do sistema.",
    "options": [
      "-u USUÁRIO   Executa o comando como o usuário especificado em vez de root",
      "-i, -s       Inicia um shell com privilégios elevados"
    ],
    "examples": [
      "sudo ls /etc                 Lista /etc com privilégios de administrador",
      "sudo mkdir /tmp/myfolder     Cria diretório como superusuário"
    ]
  },
  "head": {
    "section": "1",
    "short": "exibe a parte inicial (primeiras linhas) de arquivos",
    "synopsis": "head [OPÇÕES]... [ARQUIVO]...",
    "description": "Imprime as primeiras 10 linhas de cada ARQUIVO na saída padrão (ou o número de linhas especificado com -n).",
    "options": [
      "-n, --lines=N    Imprime as primeiras N linhas em vez das 10 primeiras",
      "-c, --bytes=N    Imprime os primeiros N bytes"
    ],
    "examples": [
      "head documents/notes.txt         Mostra as 10 primeiras linhas",
      "head -n 2 documents/notes.txt    Mostra apenas as 2 primeiras linhas"
    ]
  },
  "tail": {
    "section": "1",
    "short": "exibe a parte final (últimas linhas) de arquivos",
    "synopsis": "tail [OPÇÕES]... [ARQUIVO]...",
    "description": "Imprime as últimas 10 linhas de cada ARQUIVO na saída padrão (ou o número de linhas especificado com -n).",
    "options": [
      "-n, --lines=N    Imprime as últimas N linhas em vez das 10 últimas",
      "-f, --follow     Acompanha novos dados conforme o arquivo cresce"
    ],
    "examples": [
      "tail documents/notes.txt         Mostra as 10 últimas linhas",
      "tail -n 2 documents/notes.txt    Mostra apenas as 2 últimas linhas"
    ]
  },
  "sort": {
    "section": "1",
    "short": "ordena linhas de arquivos de texto",
    "synopsis": "sort [OPÇÕES]... [ARQUIVO]...",
    "description": "Ordena, mescla ou compara todas as linhas dos ARQUIVOS especificados (ou da entrada padrão) e escreve o resultado na saída padrão.",
    "options": [
      "-r, --reverse        Inverte o resultado das comparações (ordem decrescente)",
      "-n, --numeric-sort   Compara de acordo com o valor numérico da string",
      "-u, --unique         Exibe apenas a primeira de uma sequência de linhas iguais",
      "-k POS               Ordena através de uma chave/coluna específica"
    ],
    "examples": [
      "sort documents/data.txt      Ordena em ordem alfabética (A-Z)",
      "sort -r documents/data.txt   Ordena em ordem alfabética inversa (Z-A)",
      "sort -n numeros.txt          Ordena numericamente"
    ]
  },
  "uniq": {
    "section": "1",
    "short": "relata ou omite linhas repetidas adjacentes",
    "synopsis": "uniq [OPÇÕES]... [ENTRADA]",
    "description": "Filtra linhas repetidas adjacentes da ENTRADA (ou entrada padrão). Dica: como o uniq compara apenas linhas vizinhas, costuma ser usado após o sort (ex: sort arq | uniq).",
    "options": [
      "-c, --count      Prefixa as linhas pelo número de ocorrências",
      "-d, --repeated   Imprime apenas linhas duplicadas",
      "-u, --unique     Imprime apenas linhas que não se repetem"
    ],
    "examples": [
      "uniq documents/data.txt      Remove duplicatas adjacentes",
      "uniq -c documents/data.txt   Conta quantas vezes cada linha adjacente aparece",
      "sort data.txt | uniq -c      Ordena e conta todas as ocorrências"
    ]
  },
  "wc": {
    "section": "1",
    "short": "imprime a contagem de novas linhas, palavras e bytes de arquivos (Word Count)",
    "synopsis": "wc [OPÇÕES]... [ARQUIVO]...",
    "description": "Imprime contagens de linhas, palavras e bytes para cada ARQUIVO.",
    "options": [
      "-l, --lines      Imprime apenas a contagem de linhas",
      "-w, --words      Imprime apenas a contagem de palavras",
      "-c, --bytes      Imprime apenas a contagem de bytes",
      "-m, --chars      Imprime apenas a contagem de caracteres"
    ],
    "examples": [
      "wc documents/readme.txt      Mostra linhas, palavras e bytes",
      "wc -l documents/notes.txt    Mostra apenas o total de linhas"
    ]
  },
  "cut": {
    "section": "1",
    "short": "remove seções (colunas/campos) de cada linha de arquivos",
    "synopsis": "cut OPÇÃO... [ARQUIVO]...",
    "description": "Imprime partes selecionadas de linhas de cada ARQUIVO na saída padrão.",
    "options": [
      "-d, --delimiter=DELIM  Usa DELIM em vez de TAB como delimitador de campo",
      "-f, --fields=LISTA     Seleciona apenas estes campos (ex: -f 1, -f 1,3)",
      "-c, --characters=LISTA Seleciona apenas estes caracteres"
    ],
    "examples": [
      "cut -d \" \" -f 1 documents/notes.txt   Extrai a 1ª palavra de cada linha",
      "cut -d , -f 4 members.csv             Extrai a 4ª coluna de um CSV"
    ]
  },
  "tr": {
    "section": "1",
    "short": "traduz, substitui ou exclui caracteres (Translate)",
    "synopsis": "tr [OPÇÕES]... CONJUNTO1 [CONJUNTO2]",
    "description": "Traduz, comprime e/ou exclui caracteres exclusivamente da entrada padrão (stdin), escrevendo na saída padrão. Não aceita arquivo diretamente como argumento.",
    "options": [
      "-d, --delete           Exclui os caracteres do CONJUNTO1",
      "-s, --squeeze-repeats  Substitui caracteres repetidos por uma única ocorrência"
    ],
    "examples": [
      "tr \"a-z\" \"A-Z\" < documents/readme.txt   Converte minúsculas em maiúsculas",
      "cat readme.txt | tr \"a-z\" \"A-Z\"         Converte via pipeline"
    ]
  },
  "sed": {
    "section": "1",
    "short": "editor de fluxo para filtrar e transformar texto (Stream Editor)",
    "synopsis": "sed [OPÇÕES]... 'SCRIPT' [ARQUIVO]...",
    "description": "O sed é um editor de fluxo usado para realizar transformações básicas de texto em um fluxo de entrada (um arquivo ou entrada de um pipeline).",
    "options": [
      "-i, --in-place   Edita os arquivos diretamente no local (salva as alterações)",
      "-n, --quiet      Suprime a impressão automática do espaço de padrão",
      "-e SCRIPT        Adiciona o script aos comandos a serem executados"
    ],
    "examples": [
      "sed \"s/Linux/GNU-Linux/g\" documents/readme.txt   Substitui Linux por GNU-Linux na tela",
      "sed -i \"s/Tokyo/Osaka/g\" members.csv             Altera o arquivo diretamente"
    ]
  },
  "awk": {
    "section": "1",
    "short": "linguagem de escaneamento e processamento de padrões de texto",
    "synopsis": "awk [OPÇÕES] 'PROGRAMA' [ARQUIVO]...",
    "description": "O awk processa arquivos de texto linha por linha, dividindo cada linha em campos ($1, $2, ..., $0 para a linha inteira) pelo separador de campo (espaço por padrão, ou definido por -F).",
    "options": [
      "-F SEP           Define o separador de campos (ex: -F, para arquivos CSV)"
    ],
    "examples": [
      "awk '{print $1}' documents/notes.txt     Imprime a primeira coluna de cada linha",
      "awk -F, '{print $2, $4}' members.csv    Imprime nome e cidade do CSV"
    ]
  },
  "ln": {
    "section": "1",
    "short": "cria links (atalhos/apontadores) entre arquivos",
    "synopsis": "ln [OPÇÕES]... ALVO NOME_DO_LINK",
    "description": "Cria links físicos (hard links) por padrão, ou links simbólicos (soft/symbolic links) com a opção -s.",
    "options": [
      "-s, --symbolic   Cria links simbólicos em vez de links físicos",
      "-f, --force      Remove arquivos de destino existentes",
      "-v, --verbose    Imprime o nome de cada arquivo vinculado"
    ],
    "examples": [
      "ln -s documents/readme.txt readme-link   Cria um link simbólico",
      "ln documents/notes.txt notes-hard.txt    Cria um link físico (hardlink)"
    ]
  },
  "tar": {
    "section": "1",
    "short": "utilitário de arquivamento para criar, listar e extrair pacotes .tar",
    "synopsis": "tar [OPÇÕES]... [ARQUIVO]...",
    "description": "O GNU tar salva muitos arquivos juntos em um único arquivo de fita ou disco (.tar) e pode restaurar arquivos individuais do pacote.",
    "options": [
      "-c, --create     Cria um novo arquivo tar",
      "-x, --extract    Extrai arquivos de um pacote tar",
      "-t, --list       Lista o conteúdo de um pacote tar",
      "-f, --file=ARQ   Usa o arquivo de pacote especificado",
      "-v, --verbose    Lista detalhadamente os arquivos processados",
      "-z, --gzip       Filtra o arquivo através do gzip (.tar.gz)"
    ],
    "examples": [
      "tar -cf docs.tar documents   Empacota a pasta documents em docs.tar",
      "tar -tf docs.tar             Lista os arquivos dentro de docs.tar",
      "tar -xf docs.tar             Extrai o conteúdo de docs.tar"
    ]
  },
  "gzip": {
    "section": "1",
    "short": "compacta ou descompacta arquivos no formato .gz",
    "synopsis": "gzip [OPÇÕES]... [ARQUIVO]...",
    "description": "Reduz o tamanho dos arquivos nomeados usando codificação Lempel-Ziv (LZ77). Cada arquivo é substituído por um com a extensão .gz.",
    "options": [
      "-d, --decompress Descompacta o arquivo (equivalente a gunzip)",
      "-k, --keep       Mantém o arquivo original sem apagá-lo",
      "-v, --verbose    Exibe a porcentagem de redução de cada arquivo"
    ],
    "examples": [
      "gzip documents/notes.txt         Compacta para documents/notes.txt.gz",
      "gzip -d documents/notes.txt.gz   Descompacta de volta para notes.txt"
    ]
  },
  "gunzip": {
    "section": "1",
    "short": "descompacta arquivos comprimidos com gzip (.gz)",
    "synopsis": "gunzip [OPÇÕES]... [ARQUIVO]...",
    "description": "Restaura arquivos compactados (.gz) de volta à sua forma original não comprimida.",
    "options": [
      "-k, --keep       Mantém o arquivo .gz original após descompactar"
    ],
    "examples": [
      "gunzip documents/notes.txt.gz    Restaura documents/notes.txt"
    ]
  },
  "ps": {
    "section": "1",
    "short": "relata um instantâneo dos processos atuais em execução",
    "synopsis": "ps [OPÇÕES]",
    "description": "Exibe informações sobre uma seleção dos processos ativos no sistema.",
    "options": [
      "aux              Exibe todos os processos de todos os usuários com detalhes de CPU/Memória",
      "-ef              Exibe listagem completa em formato padrão Unix"
    ],
    "examples": [
      "ps               Lista processos do terminal atual",
      "ps aux           Lista todos os processos do sistema"
    ]
  },
  "top": {
    "section": "1",
    "short": "exibe os processos do Linux e o uso de recursos do sistema",
    "synopsis": "top",
    "description": "Fornece uma visão dinâmica do sistema em execução, mostrando uso de CPU, memória RAM e os processos que mais consomem recursos.",
    "options": [
      "-b               Opera em modo batch",
      "-n NUM           Número de iterações"
    ],
    "examples": [
      "top              Exibe o painel de processos e recursos do sistema"
    ]
  },
  "kill": {
    "section": "1",
    "short": "envia um sinal para encerrar um processo pelo PID",
    "synopsis": "kill [-SINAL] PID...",
    "description": "Envia o sinal especificado (SIGTERM 15 por padrão) para os processos indicados pelos seus IDs (PID).",
    "options": [
      "-9, -KILL        Envia sinal SIGKILL (força o encerramento imediato)",
      "-15, -TERM       Envia sinal SIGTERM (encerramento limpo padrão)",
      "-l               Lista todos os nomes de sinais disponíveis"
    ],
    "examples": [
      "kill 123         Encerra o processo de PID 123",
      "kill -9 123      Força o encerramento imediato do processo 123"
    ]
  },
  "df": {
    "section": "1",
    "short": "relata o uso de espaço em disco do sistema de arquivos (Disk Free)",
    "synopsis": "df [OPÇÕES]... [ARQUIVO]...",
    "description": "Exibe a quantidade de espaço em disco total, usado e disponível nos sistemas de arquivos montados.",
    "options": [
      "-h, --human-readable  Imprime tamanhos em potências de 1024 (ex: 50G, 12G)",
      "-T, --print-type      Imprime o tipo do sistema de arquivos (ext4, tmpfs)"
    ],
    "examples": [
      "df -h            Mostra uso de disco em formato legível"
    ]
  },
  "du": {
    "section": "1",
    "short": "estima o uso de espaço de arquivos e diretórios (Disk Usage)",
    "synopsis": "du [OPÇÕES]... [ARQUIVO]...",
    "description": "Resume o uso de disco de cada ARQUIVO e recursivamente para cada diretório.",
    "options": [
      "-h, --human-readable  Imprime tamanhos em formato legível (ex: 4.0K, 24M)",
      "-s, --summarize       Exibe apenas um total para cada argumento"
    ],
    "examples": [
      "du -h            Exibe o tamanho das subpastas do diretório atual",
      "du -sh documents Exibe o tamanho total resumido de documents"
    ]
  },
  "diff": {
    "section": "1",
    "short": "compara arquivos linha por linha",
    "synopsis": "diff [OPÇÕES]... ARQUIVO1 ARQUIVO2",
    "description": "Compara o conteúdo de dois arquivos linha por linha e mostra as adições, remoções ou alterações necessárias para igualá-los.",
    "options": [
      "-u, --unified    Exibe contexto unificado (formato usado pelo git diff)",
      "-i               Ignora diferenças de maiúsculas e minúsculas"
    ],
    "examples": [
      "diff documents/readme.txt documents/notes.txt"
    ]
  },
  "env": {
    "section": "1",
    "short": "exibe as variáveis de ambiente atuais ou executa um programa em ambiente modificado",
    "synopsis": "env",
    "description": "Sem argumentos, imprime todas as variáveis de ambiente exportadas na sessão atual do shell.",
    "options": [],
    "examples": [
      "env              Lista variáveis como USER, HOME, PATH, PWD, SHELL"
    ]
  },
  "which": {
    "section": "1",
    "short": "localiza o caminho do executável de um comando no $PATH",
    "synopsis": "which COMANDO...",
    "description": "Retorna o caminho completo do(s) binário(s) que seriam executados no ambiente atual.",
    "options": [
      "-a               Imprime todos os caminhos correspondentes em todo o PATH"
    ],
    "examples": [
      "which ls         Retorna /usr/bin/ls",
      "which grep       Retorna /usr/bin/grep"
    ]
  },
  "whoami": {
    "section": "1",
    "short": "imprime o nome do usuário efetivo atual",
    "synopsis": "whoami",
    "description": "Imprime o nome de usuário associado ao ID de usuário efetivo atual.",
    "options": [],
    "examples": [
      "whoami           Exibe: user"
    ]
  },
  "date": {
    "section": "1",
    "short": "imprime ou define a data e a hora do sistema",
    "synopsis": "date [+FORMATO]",
    "description": "Exibe a data e hora atuais no formato padrão ou de acordo com a string de formato informada.",
    "options": [
      "-u, --utc        Imprime o horário em UTC (Tempo Universal Coordenado)",
      "+%Y-%m-%d        Formata como AAAA-MM-DD"
    ],
    "examples": [
      "date             Exibe data e hora completas",
      "date +%Y-%m-%d   Exibe por exemplo 2026-10-26"
    ]
  },
  "uname": {
    "section": "1",
    "short": "imprime informações sobre o sistema operacional e o kernel",
    "synopsis": "uname [OPÇÕES]...",
    "description": "Imprime informações específicas do sistema (por padrão equivale a -s, exibindo o nome do kernel: Linux).",
    "options": [
      "-a, --all             Imprime todas as informações (kernel, host, versão, arquitetura)",
      "-r, --kernel-release  Imprime a versão de lançamento do kernel",
      "-m, --machine         Imprime a arquitetura de hardware (ex: x86_64)"
    ],
    "examples": [
      "uname -a         Exibe informações completas do kernel Linux"
    ]
  },
  "uptime": {
    "section": "1",
    "short": "informa há quanto tempo o sistema está em execução e a carga média",
    "synopsis": "uptime [-p]",
    "description": "Exibe a hora atual, há quanto tempo o sistema está ligado, quantos usuários estão conectados e a média de carga (load average) nos últimos 1, 5 e 15 minutos.",
    "options": [
      "-p, --pretty     Exibe o tempo de atividade em formato amigável"
    ],
    "examples": [
      "uptime"
    ]
  },
  "tree": {
    "section": "1",
    "short": "lista o conteúdo de diretórios em um formato de árvore visual",
    "synopsis": "tree [-a] [-d] [-L nível] [DIRETÓRIO]",
    "description": "Programa de listagem recursiva de diretórios que produz uma listagem indentada em profundidade de arquivos e pastas.",
    "options": [
      "-a               Mostra também arquivos ocultos",
      "-d               Lista apenas diretórios"
    ],
    "examples": [
      "tree             Exibe a árvore a partir do diretório atual",
      "tree documents   Exibe a árvore da pasta documents"
    ]
  },
  "nano": {
    "section": "1",
    "short": "editor de texto interativo simples e amigável para o terminal (GNU nano)",
    "synopsis": "nano [ARQUIVO]",
    "description": "Abre um editor de texto diretamente no terminal para criar ou editar arquivos. Use Ctrl+O para salvar e Ctrl+X para sair.",
    "options": [],
    "examples": [
      "nano documents/notes.txt   Abre notes.txt para edição interativa",
      "nano novo.txt              Cria e edita novo.txt"
    ]
  },
  "git": {
    "section": "1",
    "short": "sistema de controle de versão distribuído",
    "synopsis": "git <subcomando> [opções]",
    "description": "O Git é um sistema de controle de versão distribuído rápido e escalável.",
    "options": [
      "init             Cria um repositório Git vazio ou reinicializa um existente",
      "status           Mostra o estado da árvore de trabalho e área de stage",
      "add <arquivo>    Adiciona o conteúdo de arquivos ao índice (stage)",
      "commit -m \"msg\"  Registra as alterações no repositório",
      "diff [--staged]  Mostra diferenças ainda não preparadas ou em stage",
      "restore --staged Remove arquivo da área de stage sem apagar do disco",
      "log [--oneline]  Mostra o histórico de commits",
      "branch [-d nome] Lista, cria ou remove ramificações (branches)",
      "switch [-c nome] Muda de ramificação (ou cria com -c)",
      "merge <branch>   Mescla alterações de outra ramificação na atual",
      "stash [pop|list] Guarda e restaura alterações temporárias"
    ],
    "examples": [
      "git init",
      "git add README.md",
      "git restore --staged .env",
      "git commit -m \"first commit\"",
      "git switch -c hotfix"
    ]
  },
  "docker": {
    "section": "1",
    "short": "gerenciador de contêineres e imagens de aplicação",
    "synopsis": "docker <subcomando> [opções]",
    "description": "Plataforma para construir imagens, executar, inspecionar e gerenciar contêineres isolados.",
    "options": [
      "pull <imagem>    Baixa uma imagem do registro Docker Hub",
      "images           Lista as imagens armazenadas localmente",
      "build -t tag .   Constrói uma imagem a partir de um Dockerfile",
      "run [opções] img Cria e inicia um novo contêiner (-d background, -p porta, --name)",
      "start <nome/id>  Inicia um contêiner que estava parado",
      "ps [-a]          Lista contêineres em execução (ou todos com -a)",
      "logs <nome/id>   Exibe a saída e logs de um contêiner",
      "exec -it c cmd   Executa um comando dentro de um contêiner ativo",
      "inspect <obj>    Mostra metadados JSON de contêineres ou imagens",
      "stop <nome/id>   Para um contêiner em execução",
      "rm [-f] <nome>   Remove um contêiner (-f força remoção de ativo)",
      "rmi [-f] <img >  Remove uma imagem não utilizada por contêineres"
    ],
    "examples": [
      "docker pull hello-world",
      "docker run -d --name web2 -p 8080:80 nginx",
      "docker logs web2",
      "docker exec -it web2 uname -a"
    ]
  },
  "sqlite3": {
    "section": "1",
    "short": "interface de linha de comando para bancos de dados SQLite 3",
    "synopsis": "sqlite3 [-csv] ARQUIVO_DB [SQL_OU_COMANDO]",
    "description": "O sqlite3 é um terminal baseado em texto para inspecionar e executar consultas SQL em bancos SQLite (como gym.db e gym_legacy.db). Se executado sem consulta SQL, abre o modo interativo \"sqlite>\".",
    "options": [
      "-csv             Define o modo de saída como CSV (separado por vírgulas)",
      ".tables          Lista todas as tabelas do banco de dados",
      ".schema [tabela] Mostra as instruções CREATE TABLE das tabelas",
      ".quit / .exit    Sai do modo interativo sqlite>"
    ],
    "examples": [
      "sqlite3 gym.db .tables",
      "sqlite3 gym.db \"SELECT COUNT(*) FROM members;\"",
      "sqlite3 gym.db                                  (Abre o prompt interativo sqlite>)"
    ]
  },
  "clear": {
    "section": "1",
    "short": "limpa a tela do terminal",
    "synopsis": "clear",
    "description": "Limpa o histórico visual exibido na tela do terminal (atalho equivalente: Ctrl+L).",
    "options": [],
    "examples": [
      "clear"
    ]
  },
  "history": {
    "section": "1",
    "short": "exibe o histórico de comandos digitados na sessão",
    "synopsis": "history [-c]",
    "description": "Mostra a lista numerada de comandos executados anteriormente. Você pode repetir um comando usando !N (onde N é o número) ou !! para repetir o último comando.",
    "options": [
      "-c               Limpa a lista de histórico atual"
    ],
    "examples": [
      "history          Lista os comandos executados",
      "!!               Executa novamente o comando anterior"
    ]
  },
  "stat": {
    "section": "1",
    "short": "exibe o estado detalhado de arquivos ou sistemas de arquivos (inode, permissões, datas)",
    "synopsis": "stat [OPÇÕES]... ARQUIVO...",
    "description": "Mostra informações detalhadas de metadados do inode, tamanho, blocos, permissões em octal e simbólico, UID/GID e carimbos de tempo.",
    "options": [],
    "examples": [
      "stat documents/readme.txt"
    ]
  },
  "file": {
    "section": "1",
    "short": "determina o tipo de conteúdo de um arquivo",
    "synopsis": "file ARQUIVO...",
    "description": "Testa cada argumento tentando classificá-lo (diretório, script shell, banco SQLite, pacote tar/gzip, texto ASCII).",
    "options": [],
    "examples": [
      "file gym.db",
      "file projects/test.sh"
    ]
  },
  "xargs": {
    "section": "1",
    "short": "constrói e executa linhas de comando a partir da entrada padrão (stdin)",
    "synopsis": "xargs [-I SUBST] [-n MAX_ARGS] [COMANDO [ARGS_INICIAIS]]",
    "description": "Lê itens da entrada padrão separados por espaço ou quebras de linha e executa o COMANDO utilizando esses itens como argumentos.",
    "options": [
      "-I SUBST         Substitui ocorrências de SUBST nos argumentos pelo item lido",
      "-n MAX           Usa no máximo MAX argumentos por execução do comando"
    ],
    "examples": [
      "find documents -name \"*.txt\" | xargs wc -l",
      "echo \"a.txt b.txt\" | xargs touch"
    ]
  },
  "tee": {
    "section": "1",
    "short": "lê da entrada padrão e grava simultaneamente na saída padrão e em arquivos",
    "synopsis": "tee [-a] ARQUIVO...",
    "description": "Copia a entrada padrão para cada ARQUIVO e também para a saída padrão (útil no meio de pipelines).",
    "options": [
      "-a, --append     Anexa aos arquivos dados em vez de sobrescrevê-los"
    ],
    "examples": [
      "ls -la | tee lista.txt",
      "echo \"Nova linha\" | tee -a log.txt"
    ]
  },
  "export": {
    "section": "1",
    "short": "define variáveis exportadas para o ambiente de comandos subsequentes",
    "synopsis": "export [NOME[=VALOR] ...] ou export -p",
    "description": "Marca variáveis do shell para serem passadas automaticamente ao ambiente de processos filhos.",
    "options": [
      "-p               Lista todas as variáveis exportadas no ambiente atual"
    ],
    "examples": [
      "export PORT=8080",
      "export APP_ENV=\"production\""
    ]
  },
  "alias": {
    "section": "1",
    "short": "define ou exibe apelidos (aliases) de comandos no shell",
    "synopsis": "alias [nome[=valor] ...]",
    "description": "Sem argumentos, imprime a lista de aliases ativos. Quando nome=valor é fornecido, cria um atalho de comando.",
    "options": [],
    "examples": [
      "alias",
      "alias ll=\"ls -la\"",
      "unalias ll"
    ]
  },
  "systemctl": {
    "section": "1",
    "short": "controla o sistema systemd e o gerenciador de serviços (daemons)",
    "synopsis": "systemctl [COMANDO] [SERVIÇO]",
    "description": "Inspeciona e controla o estado do gerenciador de sistema e serviços Linux (nginx, ssh, docker, cron, postgresql).",
    "options": [
      "status <serviço>   Mostra o estado detalhado e logs recentes do serviço",
      "start <serviço>    Inicia o serviço especificado",
      "stop <serviço>     Para o serviço em execução",
      "restart <serviço>  Reinicia o serviço",
      "list-units         Lista todas as unidades de serviço ativas"
    ],
    "examples": [
      "systemctl status nginx",
      "sudo systemctl restart nginx"
    ]
  },
  "apt": {
    "section": "8",
    "short": "interface de linha de comando para gerenciamento de pacotes Debian/Ubuntu",
    "synopsis": "sudo apt [update | upgrade | install | remove | purge | autoremove | search | show | list] [PACOTE]",
    "description": "Fornece uma interface de alto nível para buscar, instalar, atualizar e remover pacotes de software do sistema.",
    "options": [
      "update             Atualiza a lista de pacotes disponíveis dos repositórios",
      "upgrade            Atualiza todos os pacotes instalados para versões recentes",
      "install <pacote>   Instala um ou mais pacotes (requer sudo)",
      "remove <pacote>    Remove o pacote mantendo arquivos de configuração (requer sudo)",
      "purge <pacote>     Remove o pacote e também seus arquivos de configuração (requer sudo)",
      "autoremove         Remove automaticamente dependências órfãs (requer sudo)",
      "search <termo>     Busca pacotes pelo nome ou descrição",
      "list --installed   Lista todos os pacotes instalados"
    ],
    "examples": [
      "sudo apt update && sudo apt upgrade",
      "sudo apt install cowsay",
      "sudo apt remove cowsay",
      "sudo apt purge cowsay"
    ]
  },
  "ip": {
    "section": "8",
    "short": "mostra e manipula roteamento, dispositivos de rede e interfaces (iproute2)",
    "synopsis": "ip [OBJECT] [COMMAND]",
    "description": "Utilitário moderno do Linux para exibir e configurar interfaces de rede (substituto do antigo ifconfig).",
    "options": [
      "a, addr            Exibe os endereços IPv4/IPv6 de todas as interfaces de rede",
      "r, route           Exibe a tabela de roteamento do kernel",
      "link               Exibe o estado das interfaces físicas e virtuais"
    ],
    "examples": [
      "ip a",
      "ip route"
    ]
  },
  "ping": {
    "section": "8",
    "short": "envia pacotes ICMP ECHO_REQUEST para testar conectividade de rede",
    "synopsis": "ping [-c CONTAGEM] DESTINO",
    "description": "Testa a alcançabilidade e mede o tempo de ida e volta (latência em ms) até um host ou endereço IP.",
    "options": [
      "-c CONTAGEM        Para após enviar CONTAGEM pacotes"
    ],
    "examples": [
      "ping -c 4 8.8.8.8",
      "ping localhost"
    ]
  },
  "curl": {
    "section": "1",
    "short": "transfere dados de ou para um servidor usando URLs (HTTP, HTTPS, FTP)",
    "synopsis": "curl [OPÇÕES]... URL",
    "description": "Ferramenta para realizar requisições HTTP/HTTPS diretamente pelo terminal.",
    "options": [
      "-I, --head         Busca e exibe apenas os cabeçalhos HTTP da resposta",
      "-s, --silent       Modo silencioso",
      "-o ARQUIVO         Grava a saída em ARQUIVO em vez de imprimir na tela"
    ],
    "examples": [
      "curl http://localhost",
      "curl -I https://penguin-gym-linux.com"
    ]
  },
  "apropos": {
    "section": "1",
    "short": "pesquisa os nomes e descrições das páginas de manual por palavras-chave",
    "synopsis": "apropos [OPÇÕES] PALAVRA_CHAVE...",
    "description": "Pesquisa nas descrições resumidas das páginas de manual do sistema em busca de termos ou expressões regulares e exibe os resultados correspondentes.",
    "options": [
      "-r, --regex        Interpreta cada palavra-chave como expressão regular",
      "-w, --wildcard     Interpreta cada palavra-chave como padrão curinga"
    ],
    "examples": [
      "apropos rede",
      "apropos manual"
    ]
  },
  "whatis": {
    "section": "1",
    "short": "exibe descrições resumidas de comandos e manuais em uma linha",
    "synopsis": "whatis [OPÇÕES] COMANDO...",
    "description": "Pesquisa o banco de dados do sistema e exibe a descrição resumida em uma única linha dos comandos especificados.",
    "options": [
      "-r, --regex        Interpreta argumentos como expressão regular",
      "-w, --wildcard     Permite uso de caracteres curingas"
    ],
    "examples": [
      "whatis ls",
      "whatis tar",
      "whatis apropos"
    ]
  },
  "more": {
    "section": "1",
    "short": "filtro para exibição de texto em páginas no terminal",
    "synopsis": "more [OPÇÕES] [ARQUIVO...]",
    "description": "Utilitário de paginação simples que exibe arquivos de texto uma tela por vez.",
    "options": [
      "-d                 Exibe mensagens de ajuda amigáveis",
      "+NUM               Começa a exibir a partir da linha NUM"
    ],
    "examples": [
      "more documents/readme.txt"
    ]
  },
  "less": {
    "section": "1",
    "short": "visualizador de texto interativo com rolagem bidirecional no terminal",
    "synopsis": "less [OPÇÕES] [ARQUIVO...]",
    "description": "Visualizador de arquivos de texto mais poderoso que o more, permitindo navegação para frente e para trás, busca por termos e paginação sem carregar o arquivo inteiro na memória.",
    "options": [
      "-N                 Exibe números de linha na margem esquerda",
      "-S                 Trunca linhas longas em vez de quebrar na tela",
      "-i                 Ignora maiúsculas e minúsculas na busca"
    ],
    "examples": [
      "less documents/readme.txt",
      "ls -la | less"
    ]
  },
  "neofetch": {
    "section": "1",
    "short": "exibe informações do sistema com logotipo em arte ASCII da distribuição",
    "synopsis": "neofetch [OPÇÕES]",
    "description": "Utilitário visual de linha de comando que coleta dados de hardware, kernel, pacotes instalados e memória RAM, apresentando-os ao lado do logotipo estilizado do sistema operacional.",
    "options": [
      "--off              Desativa exibição do logo ASCII",
      "--ascii_distro D   Força o logo de uma distribuição específica"
    ],
    "examples": [
      "neofetch"
    ]
  },
  "cowsay": {
    "section": "1",
    "short": "gera imagem de vaca falante em arte ASCII com balão de texto",
    "synopsis": "cowsay [OPÇÕES] [MENSAGEM...]",
    "description": "Gera uma representação gráfica em arte ASCII de uma vaca falando ou pensando a mensagem informada pelo usuário.",
    "options": [
      "-b                 Modo borg",
      "-d                 Modo morto",
      "-g                 Modo ganancioso"
    ],
    "examples": [
      "cowsay \"Linux é incrível!\"",
      "fortune | cowsay"
    ]
  },
  "jq": {
    "section": "1",
    "short": "processador de dados JSON flexível e leve para linha de comando",
    "synopsis": "jq [OPÇÕES] FILTRO [ARQUIVO...]",
    "description": "Transforma, filtra, formata e extrai campos de arquivos ou fluxos de dados JSON diretamente no terminal.",
    "options": [
      "-r, --raw-output   Emite strings como texto puro sem aspas",
      "-c, --compact-output Emite cada objeto JSON em linha única compacta"
    ],
    "examples": [
      "cat config.json | jq .",
      "jq '.name' config.json"
    ]
  },
  "wget": {
    "section": "1",
    "short": "transferidor de arquivos de rede não interativo (HTTP, HTTPS, FTP)",
    "synopsis": "wget [OPÇÕES]... [URL]...",
    "description": "Baixa arquivos diretamente da internet ou redes locais, com suporte a retomada de downloads, limites de velocidade e modo recursivo.",
    "options": [
      "-O ARQUIVO         Grava os documentos no arquivo indicado",
      "-q, --quiet        Modo silencioso, desativa saída de progresso",
      "-c, --continue     Retoma download parcialmente baixado"
    ],
    "examples": [
      "wget http://localhost/dados.txt"
    ]
  },
  "ss": {
    "section": "8",
    "short": "utilitário moderno para investigação de sockets e conexões de rede",
    "synopsis": "ss [OPÇÕES] [FILTRO]",
    "description": "Substituto moderno e de alto desempenho do netstat. Exibe informações detalhadas de sockets TCP, UDP, portas abertas e conexões estabelecidas.",
    "options": [
      "-t                 Exibe apenas sockets TCP",
      "-u                 Exibe apenas sockets UDP",
      "-l                 Exibe apenas sockets em estado de escuta (LISTEN)",
      "-n                 Exibe portas e endereços numericamente sem resolução DNS",
      "-p                 Mostra o processo/PID proprietário do socket"
    ],
    "examples": [
      "ss -tulpn",
      "ss -ta"
    ]
  },
  "netstat": {
    "section": "8",
    "short": "imprime conexões de rede, tabelas de roteamento e estatísticas de interfaces",
    "synopsis": "netstat [OPÇÕES]",
    "description": "Utilitário tradicional do pacote net-tools para inspecionar conexões de rede ativas e portas de serviços no sistema.",
    "options": [
      "-t                 Conexões TCP",
      "-u                 Conexões UDP",
      "-l                 Portas em escuta (LISTEN)",
      "-n                 Endereços numéricos sem resolver nomes"
    ],
    "examples": [
      "netstat -tuln",
      "netstat -an"
    ]
  },
  "dig": {
    "section": "1",
    "short": "utilitário de consulta e diagnóstico do servidor de nomes DNS",
    "synopsis": "dig [@SERVIDOR] NOME [TIPO]",
    "description": "Ferramenta flexível para interrogar servidores de nomes DNS e inspecionar registros A, AAAA, MX, CNAME, NS e SOA.",
    "options": [
      "+short             Exibe apenas a resposta limpa (ex: endereço IP)",
      "+trace             Realiza rastreamento recursivo a partir dos root servers"
    ],
    "examples": [
      "dig penguin-gym.com",
      "dig penguin-gym.com +short",
      "dig penguin-gym.com MX"
    ]
  },
  "nslookup": {
    "section": "1",
    "short": "consulta servidores de nomes de domínio interativamente ou em lote",
    "synopsis": "nslookup [NOME_HOST] [SERVIDOR]",
    "description": "Consulta servidores de DNS para resolver endereços IP a partir de nomes de host e vice-versa.",
    "options": [
      "-type=TIPO         Define o tipo de registro consultado (A, MX, ANY)"
    ],
    "examples": [
      "nslookup penguin-gym.com"
    ]
  },
  "host": {
    "section": "1",
    "short": "utilitário simples para resolução e pesquisa de endereços DNS",
    "synopsis": "host [OPÇÕES] NOME [SERVIDOR]",
    "description": "Efetua consultas DNS de forma simples e direta, convertendo nomes em endereços IP e identificando servidores de correio eletrônico.",
    "options": [
      "-t TIPO            Especifica o tipo de registro (ex: MX, CNAME, A)",
      "-a                 Equivale a uma consulta completa de todos os registros"
    ],
    "examples": [
      "host penguin-gym.com",
      "host -t MX penguin-gym.com"
    ]
  },
  "nc": {
    "section": "1",
    "short": "canivete suíço para conexões e escuta arbitrária de sockets TCP e UDP",
    "synopsis": "nc [OPÇÕES] DESTINO PORTA",
    "description": "O Netcat (nc) lê e escreve dados através de conexões de rede utilizando os protocolos TCP ou UDP.",
    "options": [
      "-z                 Modo de escaneamento de portas, sem envio de dados",
      "-v                 Modo verboso detalhado",
      "-l                 Modo de escuta (listen) para abrir portas locais"
    ],
    "examples": [
      "nc -zv localhost 80",
      "nc -l -p 8080"
    ]
  },
  "netcat": {
    "section": "1",
    "short": "canivete suíço para leitura e escrita em conexões TCP/UDP (alias do nc)",
    "synopsis": "netcat [OPÇÕES] DESTINO PORTA",
    "description": "Alias do utilitário nc (Netcat).",
    "options": [
      "-z                 Modo scan",
      "-v                 Modo verboso"
    ],
    "examples": [
      "netcat -zv localhost 80"
    ]
  },
  "ufw": {
    "section": "8",
    "short": "programa para gerenciamento simplificado do firewall do Linux (Uncomplicated Firewall)",
    "synopsis": "ufw [OPÇÕES] COMANDO",
    "description": "Interface simplificada para configuração e gerenciamento de regras de filtragem de pacotes do firewall Linux (iptables/nftables).",
    "options": [
      "status             Exibe o estado de ativação e as regras do firewall",
      "enable             Ativa o firewall do sistema",
      "disable            Desativa o firewall do sistema",
      "allow PORTA/PROT   Permite a entrada de tráfego na porta e protocolo especificados",
      "deny PORTA/PROT    Bloqueia o tráfego de entrada na porta e protocolo"
    ],
    "examples": [
      "sudo ufw status",
      "sudo ufw enable",
      "sudo ufw allow 80/tcp"
    ]
  },
  "ssh": {
    "section": "1",
    "short": "cliente de acesso remoto e execução de comandos seguros (OpenSSH)",
    "synopsis": "ssh [OPÇÕES] [USUÁRIO@]HOST [COMANDO]",
    "description": "Inicia uma sessão de shell criptografada em um computador remoto ou executa comandos de forma segura na rede.",
    "options": [
      "-p PORTA           Especifica a porta de conexão (padrão 22)",
      "-i CHAVE           Arquivo de chave privada de autenticação"
    ],
    "examples": [
      "ssh user@servidor.com",
      "ssh -p 2222 user@localhost"
    ]
  },
  "scp": {
    "section": "1",
    "short": "cópia segura de arquivos entre computadores via túnel SSH",
    "synopsis": "scp [OPÇÕES] ORIGEM DESTINO",
    "description": "Transfere arquivos e diretórios de forma criptografada entre sistemas remotos na rede utilizando o protocolo SSH.",
    "options": [
      "-P PORTA           Porta de conexão SSH",
      "-r                 Copia diretórios recursivamente"
    ],
    "examples": [
      "scp arquivo.txt user@servidor:/tmp/"
    ]
  },
  "rsync": {
    "section": "1",
    "short": "sincronizador de arquivos e diretórios rápido e incremental",
    "synopsis": "rsync [OPÇÕES] ORIGEM DESTINO",
    "description": "Copia e sincroniza arquivos de forma eficiente transferindo apenas as diferenças (deltas) entre origem e destino.",
    "options": [
      "-a, --archive      Modo arquivamento (preserva permissões, donos e datas)",
      "-v, --verbose      Modo detalhado",
      "--delete           Remove arquivos no destino que não existem na origem"
    ],
    "examples": [
      "rsync -av documents/ backup/"
    ]
  },
  "traceroute": {
    "section": "8",
    "short": "rastreia e exibe a rota percorrida pelos pacotes na rede IP até o destino",
    "synopsis": "traceroute [OPÇÕES] DESTINO",
    "description": "Identifica cada roteador ou gateway intermediário (hops) por onde os pacotes trafegam até alcançar o destino final.",
    "options": [
      "-n                 Exibe endereços IP numericamente sem resolução reversa",
      "-m SALTOS          Define o número máximo de saltos (padrão 30)"
    ],
    "examples": [
      "traceroute penguin-gym.com"
    ]
  },
  "journalctl": {
    "section": "1",
    "short": "consulta e filtra os logs do diário de eventos do systemd",
    "synopsis": "journalctl [OPÇÕES] [FILTROS]",
    "description": "Utilitário de linha de comando para inspecionar os logs de inicialização, kernel e serviços gerenciados pelo systemd-journald.",
    "options": [
      "-u UNIDADE         Filtra logs de uma unidade/serviço específico (ex: ssh, nginx)",
      "-n LINHAS          Mostra as últimas LINHAS do log (padrão 10)",
      "-f                 Acompanha novos logs em tempo real (follow)",
      "-p NÍVEL           Filtra por prioridade de log (ex: err, warning, info)"
    ],
    "examples": [
      "journalctl -u ssh",
      "journalctl -n 5",
      "journalctl -f"
    ]
  },
  "service": {
    "section": "8",
    "short": "executa scripts de inicialização de serviços do sistema (SysV / systemd wrapper)",
    "synopsis": "service NOME_SERVIÇO AÇÃO",
    "description": "Interface compatível para controlar o estado de serviços e daemons do sistema operacional (start, stop, restart, status).",
    "options": [
      "status             Verifica o status de execução do serviço",
      "start              Inicia o serviço",
      "stop               Para o serviço",
      "restart            Reinicia o serviço"
    ],
    "examples": [
      "sudo service nginx status",
      "sudo service ssh restart"
    ]
  },
  "crontab": {
    "section": "1",
    "short": "mantém e gerencia arquivos de tabelas de tarefas periódicas do cron",
    "synopsis": "crontab [OPÇÕES]",
    "description": "Permite ao usuário visualizar, editar ou remover agendamentos automáticos de execução periódica de scripts e comandos no sistema.",
    "options": [
      "-l                 Exibe as tarefas agendadas do crontab atual",
      "-e                 Abre o editor para modificar as tarefas",
      "-r                 Remove todas as tarefas do crontab do usuário"
    ],
    "examples": [
      "crontab -l",
      "crontab -e"
    ]
  },
  "dpkg": {
    "section": "1",
    "short": "gerenciador de pacotes de software de baixo nível para sistemas Debian",
    "synopsis": "dpkg [OPÇÕES] AÇÃO [PACOTE]",
    "description": "Instala, remove, pesquisa e inspeciona arquivos de pacotes debian (.deb) diretamente no sistema.",
    "options": [
      "-l [PADRÃO]        Lista os pacotes instalados correspondentes ao padrão",
      "-s PACOTE          Exibe o status e detalhes do pacote informado",
      "-i ARQUIVO.deb     Instala um pacote local",
      "-r PACOTE          Remove um pacote instalado"
    ],
    "examples": [
      "dpkg -l",
      "dpkg -s nginx"
    ]
  },
  "apt-get": {
    "section": "8",
    "short": "ferramenta tradicional de gerenciamento de pacotes APT da distribuição Debian",
    "synopsis": "apt-get [OPÇÕES] COMANDO [PACOTE...]",
    "description": "Utilitário de linha de comando para manipular pacotes, resolver dependências e atualizar o sistema operacional Debian/Ubuntu.",
    "options": [
      "update             Atualiza a lista de repositórios",
      "install PACOTE     Instala novos pacotes",
      "remove PACOTE      Remove pacotes existentes",
      "upgrade            Atualiza os programas instalados"
    ],
    "examples": [
      "sudo apt-get update",
      "sudo apt-get install nginx"
    ]
  },
  "free": {
    "section": "1",
    "short": "exibe a quantidade de memória livre e usada no sistema (RAM e Swap)",
    "synopsis": "free [OPÇÕES]",
    "description": "Informa os valores totais, utilizados, livres e compartilhados da memória física (RAM) e da área de paginação (Swap).",
    "options": [
      "-h, --human        Exibe os valores em formatos legíveis (GiB, MiB)",
      "-m                 Exibe a memória em Megabytes",
      "-g                 Exibe a memória em Gigabytes"
    ],
    "examples": [
      "free -h",
      "free -m"
    ]
  },
  "lscpu": {
    "section": "1",
    "short": "exibe informações sobre a arquitetura da CPU e processadores do computador",
    "synopsis": "lscpu [OPÇÕES]",
    "description": "Coleta informações do sysfs e /proc/cpuinfo, exibindo detalhes como arquitetura (x86_64, arm), quantidade de núcleos, threads, frequências e caches.",
    "options": [
      "-e                 Gera saída detalhada por CPU em formato tabular"
    ],
    "examples": [
      "lscpu"
    ]
  },
  "lsblk": {
    "section": "8",
    "short": "lista informações sobre todos os dispositivos de bloco e unidades de disco",
    "synopsis": "lsblk [OPÇÕES] [DISPOSITIVO]",
    "description": "Exibe a árvore hierárquica de discos de armazenamento, partições, volumes LVM e seus respectivos pontos de montagem.",
    "options": [
      "-f                 Exibe informações sobre o sistema de arquivos (UUID, FSTYPE)",
      "-m                 Exibe permissões e proprietários dos dispositivos"
    ],
    "examples": [
      "lsblk",
      "lsblk -f"
    ]
  },
  "dmesg": {
    "section": "1",
    "short": "imprime ou controla o buffer de mensagens e diagnósticos do kernel Linux",
    "synopsis": "dmesg [OPÇÕES]",
    "description": "Exibe os registros de mensagens gerados pelo kernel do sistema operacional durante a inicialização (boot) e operação de hardware.",
    "options": [
      "-T, --ctime        Exibe carimbos de data/hora legíveis para humanos",
      "-l, --level NÍVEL  Filtra mensagens por nível (err, warn, info)"
    ],
    "examples": [
      "dmesg",
      "dmesg -T",
      "dmesg | grep -i eth"
    ]
  },
  "id": {
    "section": "1",
    "short": "imprime os identificadores de usuário e grupo (UID, GID e grupos suplementares)",
    "synopsis": "id [OPÇÕES] [USUÁRIO]",
    "description": "Exibe o identificador numérico de usuário (UID), identificador de grupo primário (GID) e a lista completa de grupos aos quais o usuário pertence.",
    "options": [
      "-u                 Exibe apenas o UID numérico",
      "-g                 Exibe apenas o GID numérico do grupo primário",
      "-G                 Exibe todos os grupos (IDs numéricos)",
      "-n                 Exibe os nomes em vez dos números de ID"
    ],
    "examples": [
      "id",
      "id user",
      "id -un"
    ]
  },
  "useradd": {
    "section": "8",
    "short": "cria um novo usuário ou atualiza as informações padrão de novas contas",
    "synopsis": "useradd [OPÇÕES] LOGIN",
    "description": "Comando de baixo nível para criação de novas contas de usuário no sistema operacional Linux.",
    "options": [
      "-m, --create-home  Cria o diretório pessoal (home) do usuário se não existir",
      "-s SHELL           Define o shell de login padrão (ex: /bin/bash)",
      "-g GRUPO           Define o grupo primário do usuário",
      "-G GRUPOS          Lista de grupos suplementares (separados por vírgula)"
    ],
    "examples": [
      "sudo useradd -m devops",
      "sudo useradd -m -s /bin/bash aluno"
    ]
  },
  "adduser": {
    "section": "8",
    "short": "adiciona um usuário ou grupo ao sistema (assistente amigável do useradd)",
    "synopsis": "adduser [OPÇÕES] USUÁRIO",
    "description": "Script amigável que facilita o cadastro de novos usuários e configuração automática de diretório home e permissões.",
    "options": [
      "--home DIR         Especifica um diretório home personalizado"
    ],
    "examples": [
      "sudo adduser devops"
    ]
  },
  "userdel": {
    "section": "8",
    "short": "remove uma conta de usuário e arquivos relacionados do sistema",
    "synopsis": "userdel [OPÇÕES] LOGIN",
    "description": "Exclui a conta de usuário informada dos arquivos de configuração /etc/passwd e /etc/shadow.",
    "options": [
      "-r, --remove       Exclui também o diretório pessoal (home) e a caixa de correio do usuário"
    ],
    "examples": [
      "sudo userdel devops",
      "sudo userdel -r devops"
    ]
  },
  "usermod": {
    "section": "8",
    "short": "modifica os atributos e configurações de uma conta de usuário existente",
    "synopsis": "usermod [OPÇÕES] LOGIN",
    "description": "Permite alterar grupos, shell de login, diretório home ou expiração de uma conta já cadastrada.",
    "options": [
      "-aG GRUPO          Adiciona o usuário a um grupo suplementar sem removê-lo dos demais",
      "-s SHELL           Altera o shell de login do usuário"
    ],
    "examples": [
      "sudo usermod -aG sudo user"
    ]
  },
  "groupadd": {
    "section": "8",
    "short": "cria um novo grupo de usuários no sistema operacional",
    "synopsis": "groupadd [OPÇÕES] GRUPO",
    "description": "Cadastra um novo identificador de grupo no arquivo /etc/group.",
    "options": [
      "-g GID             Especifica um número GID numérico exclusivo"
    ],
    "examples": [
      "sudo groupadd desenvolvedores"
    ]
  },
  "groups": {
    "section": "1",
    "short": "imprime os nomes dos grupos aos quais um usuário pertence",
    "synopsis": "groups [USUÁRIO...]",
    "description": "Exibe a lista de grupos do usuário atual ou dos usuários informados como parâmetro.",
    "options": [],
    "examples": [
      "groups",
      "groups user"
    ]
  },
  "who": {
    "section": "1",
    "short": "mostra quem está conectado no sistema no momento",
    "synopsis": "who [OPÇÕES]",
    "description": "Exibe os usuários atualmente conectados, seus terminais (pts) e horários de login.",
    "options": [
      "-b                 Horário do último boot do sistema",
      "-q                 Contagem rápida de usuários"
    ],
    "examples": [
      "who",
      "who -b"
    ]
  },
  "w": {
    "section": "1",
    "short": "mostra quem está conectado e o que os usuários estão executando",
    "synopsis": "w [OPÇÕES] [USUÁRIO]",
    "description": "Exibe informações resumidas do sistema (uptime, carga média) e a lista detalhada de usuários conectados com seus processos atuais.",
    "options": [
      "-h                 Omite o cabeçalho",
      "-s                 Formato curto"
    ],
    "examples": [
      "w"
    ]
  },
  "last": {
    "section": "1",
    "short": "mostra o histórico dos últimos logins de usuários no sistema",
    "synopsis": "last [OPÇÕES] [USUÁRIO...]",
    "description": "Lê o arquivo /var/log/wtmp e lista as sessões recentes de login, logout e reinicializações do sistema.",
    "options": [
      "-n NÚMERO          Limita o número de linhas exibidas"
    ],
    "examples": [
      "last",
      "last -n 5"
    ]
  },
  "hostname": {
    "section": "1",
    "short": "exibe ou define o nome do host do sistema na rede",
    "synopsis": "hostname [OPÇÕES] [NOVO_NOME]",
    "description": "Exibe o nome de rede do computador atual ou define um novo nome.",
    "options": [
      "-I, --all-ip-addresses  Exibe todos os endereços de rede do host"
    ],
    "examples": [
      "hostname",
      "hostname -I"
    ]
  },
  "hostnamectl": {
    "section": "1",
    "short": "controla e inspeciona a configuração do nome de host no systemd",
    "synopsis": "hostnamectl [COMANDO]",
    "description": "Utilitário do systemd para consultar e alterar o nome estático, transiente ou descritivo do host.",
    "options": [
      "status             Exibe o estado detalhado do host, kernel e arquitetura"
    ],
    "examples": [
      "hostnamectl status"
    ]
  },
  "su": {
    "section": "1",
    "short": "troca o identificador de usuário ou entra como superusuário (root)",
    "synopsis": "su [OPÇÕES] [-] [USUÁRIO]",
    "description": "Inicia uma sessão como outro usuário no terminal. O hífen (-) garante que o ambiente de login do usuário alvo seja carregado.",
    "options": [
      "-                  Inicia como shell de login com as variáveis de ambiente do usuário alvo"
    ],
    "examples": [
      "su -",
      "su - user"
    ]
  },
  "unalias": {
    "section": "1",
    "short": "remove definições de atalhos de comando (aliases) do shell",
    "synopsis": "unalias [-a] NOME...",
    "description": "Remove os apelidos de comando definidos previamente pelo comando alias na sessão atual.",
    "options": [
      "-a                 Remove todos os aliases definidos"
    ],
    "examples": [
      "unalias c",
      "unalias ll"
    ]
  },
  "unset": {
    "section": "1",
    "short": "remove variáveis ou funções do ambiente do shell",
    "synopsis": "unset [-v|-f] NOME...",
    "description": "Exclui a variável de ambiente ou função informada do escopo atual do interpretador.",
    "options": [
      "-v                 Trata cada nome como variável de shell (padrão)"
    ],
    "examples": [
      "unset MINHA_VAR"
    ]
  },
  "printenv": {
    "section": "1",
    "short": "imprime todas ou parte das variáveis de ambiente do sistema",
    "synopsis": "printenv [VARIÁVEL...]",
    "description": "Exibe os valores das variáveis de ambiente atuais. Se nenhuma variável for informada, lista todas.",
    "options": [],
    "examples": [
      "printenv",
      "printenv USER",
      "printenv PATH"
    ]
  },
  "tac": {
    "section": "1",
    "short": "concatena e imprime arquivos na ordem inversa das linhas (cat invertido)",
    "synopsis": "tac [OPÇÕES] [ARQUIVO...]",
    "description": "Imprime o conteúdo do arquivo linha por linha começando da última linha até a primeira (de baixo para cima).",
    "options": [],
    "examples": [
      "tac documents/readme.txt"
    ]
  },
  "rev": {
    "section": "1",
    "short": "inverte horizontalmente a ordem dos caracteres de cada linha",
    "synopsis": "rev [ARQUIVO...]",
    "description": "Lê o texto e inverte a sequência de caracteres de cada linha da direita para a esquerda.",
    "options": [],
    "examples": [
      "rev documents/readme.txt",
      "echo \"Linux\" | rev"
    ]
  },
  "nl": {
    "section": "1",
    "short": "numera as linhas de texto de arquivos",
    "synopsis": "nl [OPÇÕES] [ARQUIVO...]",
    "description": "Lê o arquivo de texto e o imprime com números sequenciais formatados na margem de cada linha.",
    "options": [
      "-b a               Numera todas as linhas, inclusive as em branco"
    ],
    "examples": [
      "nl documents/readme.txt"
    ]
  },
  "column": {
    "section": "1",
    "short": "formata e alinha listas de texto em colunas tabulares",
    "synopsis": "column [OPÇÕES] [ARQUIVO...]",
    "description": "Transforma linhas de texto com múltiplos campos em tabelas visuais organizadas e alinhadas em colunas.",
    "options": [
      "-t                 Determina o número de colunas automaticamente e formata como tabela",
      "-s DELIM           Define o caractere delimitador de campos (ex: -s \",\")"
    ],
    "examples": [
      "column -t dados.txt",
      "column -t -s \",\" usuarios.csv"
    ]
  },
  "sha256sum": {
    "section": "1",
    "short": "calcula e verifica o código hash criptográfico SHA-256 de arquivos",
    "synopsis": "sha256sum [OPÇÕES] [ARQUIVO...]",
    "description": "Gera a soma de verificação SHA-256 (256 bits) para validar a integridade e detectar alterações em arquivos.",
    "options": [
      "-c ARQUIVO         Lê as somas de verificação do arquivo e valida cada um"
    ],
    "examples": [
      "sha256sum documents/readme.txt"
    ]
  },
  "md5sum": {
    "section": "1",
    "short": "calcula e verifica a soma de checagem MD5 de integridade",
    "synopsis": "md5sum [OPÇÕES] [ARQUIVO...]",
    "description": "Gera o hash MD5 (128 bits) para validação rápida de integridade de arquivos.",
    "options": [
      "-c ARQUIVO         Valida hashes contidos no arquivo"
    ],
    "examples": [
      "md5sum documents/readme.txt"
    ]
  },
  "base64": {
    "section": "1",
    "short": "codifica ou decodifica dados no formato padrão Base64",
    "synopsis": "base64 [OPÇÕES] [ARQUIVO]",
    "description": "Converte dados binários ou texto em representação Base64 (RFC 4648) e realiza a operação inversa de decodificação.",
    "options": [
      "-d, --decode       Decodifica dados Base64 de volta para o formato original",
      "-w COLS            Quebra as linhas codificadas no tamanho COLS (padrão 76)"
    ],
    "examples": [
      "echo \"Linux\" | base64",
      "echo \"TGludXgK\" | base64 -d"
    ]
  },
  "pushd": {
    "section": "1",
    "short": "adiciona um diretório na pilha de navegação e muda para ele",
    "synopsis": "pushd [DIRETÓRIO]",
    "description": "Salva o diretório atual no topo da pilha de pastas do shell e navega para o diretório informado.",
    "options": [],
    "examples": [
      "pushd /etc",
      "pushd ~"
    ]
  },
  "popd": {
    "section": "1",
    "short": "remove o diretório do topo da pilha e navega de volta para ele",
    "synopsis": "popd",
    "description": "Desempilha o diretório armazenado pelo pushd e retorna imediatamente para ele.",
    "options": [],
    "examples": [
      "popd"
    ]
  },
  "dirs": {
    "section": "1",
    "short": "exibe a lista dos diretórios atualmente guardados na pilha",
    "synopsis": "dirs [OPÇÕES]",
    "description": "Exibe a pilha de diretórios ativa manipulada através de pushd e popd.",
    "options": [
      "-v                 Exibe um diretório por linha com o índice da pilha"
    ],
    "examples": [
      "dirs",
      "dirs -v"
    ]
  },
  "pkill": {
    "section": "1",
    "short": "envia sinal para processos com base no nome ou outros atributos",
    "synopsis": "pkill [OPÇÕES] PADRÃO",
    "description": "Encerra processos localizando-os através do nome do executável em vez de requerer o número PID exato.",
    "options": [
      "-9                 Envia o sinal SIGKILL de encerramento forçado",
      "-u USUÁRIO         Filtra processos pertencentes ao usuário indicado"
    ],
    "examples": [
      "pkill nginx",
      "pkill -9 sleep"
    ]
  },
  "killall": {
    "section": "1",
    "short": "encerra todos os processos que executam o comando especificado",
    "synopsis": "killall [OPÇÕES] NOME...",
    "description": "Encerra todas as instâncias em execução que correspondam ao nome do programa informado.",
    "options": [
      "-9                 Encerramento forçado (SIGKILL)"
    ],
    "examples": [
      "killall sleep",
      "killall nginx"
    ]
  },
  "pgrep": {
    "section": "1",
    "short": "pesquisa processos pelo nome e imprime seus números de PID",
    "synopsis": "pgrep [OPÇÕES] PADRÃO",
    "description": "Examina a tabela de processos em execução e exibe o ID de processo (PID) de cada programa correspondente.",
    "options": [
      "-l                 Exibe o nome do processo ao lado do PID",
      "-a                 Exibe a linha de comando completa do processo"
    ],
    "examples": [
      "pgrep nginx",
      "pgrep -l bash"
    ]
  },
  "htop": {
    "section": "1",
    "short": "visualizador de processos e monitor de sistema interativo e colorido",
    "synopsis": "htop [OPÇÕES]",
    "description": "Monitor visual em tempo real de uso de CPU, núcleos, memória RAM, Swap e lista dinâmica de tarefas e processos.",
    "options": [
      "-d ATRASO          Atualiza o intervalo de exibição em décimos de segundo"
    ],
    "examples": [
      "htop"
    ]
  },
  "ifconfig": {
    "section": "8",
    "short": "configura ou exibe os parâmetros das interfaces de rede do sistema",
    "synopsis": "ifconfig [INTERFACE] [OPÇÕES]",
    "description": "Comando clássico de rede para consultar endereços IP, máscara de sub-rede e pacotes transmitidos em cada placa de rede.",
    "options": [
      "-a                 Exibe todas as interfaces, mesmo as desativadas"
    ],
    "examples": [
      "ifconfig",
      "ifconfig eth0"
    ]
  },
  "test": {
    "section": "1",
    "short": "avalia expressões condicionais e tipos de arquivo no shell (equivalente a [ ])",
    "synopsis": "test EXPRESSÃO   ou   [ EXPRESSÃO ]",
    "description": "Verifica tipos de arquivos, permissões, igualdade de strings e comparações numéricas, retornando status 0 (verdadeiro) ou 1 (falso).",
    "options": [
      "-f ARQUIVO         Verdadeiro se o arquivo existe e é um arquivo comum",
      "-d DIRETÓRIO       Verdadeiro se o diretório existe",
      "-z STRING          Verdadeiro se o comprimento da string for zero"
    ],
    "examples": [
      "[ -f config.txt ]",
      "test -d /etc"
    ]
  },
  "expr": {
    "section": "1",
    "short": "avalia e calcula expressões matemáticas e lógicas",
    "synopsis": "expr EXPRESSÃO...",
    "description": "Calcula o resultado de operações aritméticas de inteiros e comparações no terminal.",
    "options": [],
    "examples": [
      "expr 10 + 5",
      "expr 20 / 4"
    ]
  },
  "seq": {
    "section": "1",
    "short": "imprime uma sequência numérica de números inteiros",
    "synopsis": "seq [PRIMEIRO] [PASSO] ÚLTIMO",
    "description": "Gera números sequenciais do valor inicial até o valor final informado.",
    "options": [
      "-s SEPARADOR       Usa uma string personalizada para separar os números"
    ],
    "examples": [
      "seq 1 5",
      "seq 0 2 10"
    ]
  },
  "exit": {
    "section": "1",
    "short": "encerra a sessão do shell atual ou retorna ao usuário anterior",
    "synopsis": "exit [CÓDIGO]",
    "description": "Finaliza a execução do interpretador de comandos atual, retornando o código numérico especificado ou 0 por padrão.",
    "options": [],
    "examples": [
      "exit",
      "exit 0"
    ]
  },
  "logout": {
    "section": "1",
    "short": "sai de um shell de login",
    "synopsis": "logout",
    "description": "Encerra uma sessão de login interativa no terminal.",
    "options": [],
    "examples": [
      "logout"
    ]
  },
  "basename": {
    "section": "1",
    "short": "remove o caminho dos diretórios e sufixos de um nome de arquivo",
    "synopsis": "basename CAMINHO [SUFIXO]",
    "description": "Exibe apenas o nome final de um arquivo a partir de um caminho completo, eliminando pastas anteriores.",
    "options": [],
    "examples": [
      "basename /home/user/documentos/relatorio.txt",
      "basename /etc/nginx/nginx.conf .conf"
    ]
  },
  "dirname": {
    "section": "1",
    "short": "remove o nome final de um arquivo, retornando apenas o caminho do diretório pai",
    "synopsis": "dirname CAMINHO...",
    "description": "Exibe o caminho das pastas antecedentes, eliminando o último componente do nome de arquivo.",
    "options": [],
    "examples": [
      "dirname /home/user/documentos/relatorio.txt"
    ]
  },
  "realpath": {
    "section": "1",
    "short": "imprime o caminho canônico e absoluto resolvido de um arquivo",
    "synopsis": "realpath [OPÇÕES] CAMINHO...",
    "description": "Expande todos os links simbólicos e resolve referências relativas (como .. e .), exibindo o caminho absoluto canônico.",
    "options": [],
    "examples": [
      "realpath documents/readme.txt"
    ]
  },
  "readlink": {
    "section": "1",
    "short": "imprime o valor e destino de um link simbólico",
    "synopsis": "readlink [OPÇÕES] ARQUIVO...",
    "description": "Exibe o arquivo ou pasta para onde um atalho de link simbólico aponta.",
    "options": [
      "-f                 Resolve todos os links de forma canônica"
    ],
    "examples": [
      "readlink link_relatorio"
    ]
  },
  "source": {
    "section": "1",
    "short": "executa comandos de um arquivo dentro do shell atual (equivalente a .)",
    "synopsis": "source ARQUIVO [ARGUMENTOS]   ou   . ARQUIVO",
    "description": "Lê e executa comandos do arquivo especificado no contexto da sessão de shell atual, permitindo que variáveis e funções persistam.",
    "options": [],
    "examples": [
      "source script.sh",
      ". ~/.bashrc"
    ]
  },
  "bash": {
    "section": "1",
    "short": "GNU Bourne-Again SHell - interpretador de comandos e linguagem de scripts",
    "synopsis": "bash [OPÇÕES] [ARQUIVO_SCRIPT]",
    "description": "Interpretador de comandos padrão do sistema Linux, compatível com o padrão POSIX e repleto de recursos de scripting, histórico e controle de processos.",
    "options": [
      "-c COMANDO         Executa o comando informado como string e encerra",
      "-x                 Modo de depuração: exibe cada comando antes de executá-lo"
    ],
    "examples": [
      "bash script.sh",
      "bash -c \"echo Olá\""
    ]
  },
  "sh": {
    "section": "1",
    "short": "interpretador de comandos padrão POSIX (geralmente apontando para dash ou bash)",
    "synopsis": "sh [OPÇÕES] [ARQUIVO]",
    "description": "Executa scripts compatíveis com a especificação de shell padrão POSIX.",
    "options": [],
    "examples": [
      "sh script.sh"
    ]
  },
  "zip": {
    "section": "1",
    "short": "empacota e comprime arquivos no formato universal ZIP",
    "synopsis": "zip [OPÇÕES] ARQUIVO.ZIP [ARQUIVOS...]",
    "description": "Cria arquivos de arquivo compactados no formato padrão .zip amplamente compatível entre Linux, Windows e macOS.",
    "options": [
      "-r                 Comprime diretórios recursivamente"
    ],
    "examples": [
      "zip -r backup.zip documents/"
    ]
  },
  "unzip": {
    "section": "1",
    "short": "extrai arquivos compactados no formato ZIP",
    "synopsis": "unzip [OPÇÕES] ARQUIVO.ZIP",
    "description": "Lista, testa e descompacta arquivos gravados no formato .zip.",
    "options": [
      "-l                 Lista o conteúdo sem extrair os arquivos",
      "-d DIRETÓRIO       Extrai os arquivos para a pasta especificada"
    ],
    "examples": [
      "unzip backup.zip",
      "unzip -l backup.zip"
    ]
  },
  "zcat": {
    "section": "1",
    "short": "descompacta e exibe o conteúdo de arquivos gzip na tela sem gravá-los no disco",
    "synopsis": "zcat [ARQUIVO.gz...]",
    "description": "Equivalente ao comando cat para arquivos comprimidos com gzip (.gz).",
    "options": [],
    "examples": [
      "zcat documents/notes.txt.gz"
    ]
  },
  "sleep": {
    "section": "1",
    "short": "pausa a execução por um intervalo de tempo especificado",
    "synopsis": "sleep NÚMERO[SUFIXO]",
    "description": "Suspende a execução do script ou terminal por uma quantidade determinada de segundos (s), minutos (m) ou horas (h).",
    "options": [],
    "examples": [
      "sleep 2",
      "sleep 1s"
    ]
  },
  "paste": {
    "section": "1",
    "short": "combina linhas de múltiplos arquivos lado a lado horizontalmente",
    "synopsis": "paste [OPÇÕES] [ARQUIVO...]",
    "description": "Une as linhas correspondentes de cada arquivo informado, separando-as com tabulações ou delimitador personalizado.",
    "options": [
      "-d DELIM           Usa um caractere separador personalizado"
    ],
    "examples": [
      "paste arq1.txt arq2.txt"
    ]
  },
  "nmap": {
    "section": "1",
    "short": "ferramenta de exploração de rede e scanner de portas e serviços",
    "synopsis": "nmap [TIPOS_SCAN] [OPÇÕES] HOST",
    "description": "Realiza varredura de portas TCP e UDP abertas e identifica serviços de rede e versões de software rodando em hosts.",
    "options": [
      "-p PORTAS          Especifica as portas a serem escaneadas"
    ],
    "examples": [
      "nmap localhost",
      "nmap -p 80,443 localhost"
    ]
  },
  "passwd": {
    "section": "1",
    "short": "modifica a senha de autenticação de contas de usuário",
    "synopsis": "passwd [OPÇÕES] [USUÁRIO]",
    "description": "Permite ao usuário autenticado alterar sua própria senha ou ao superusuário redefinir senhas de qualquer conta.",
    "options": [],
    "examples": [
      "passwd",
      "sudo passwd user"
    ]
  },
  "mount": {
    "section": "8",
    "short": "monta um sistema de arquivos ou dispositivo de armazenamento em um diretório",
    "synopsis": "mount [OPÇÕES] DISPOSITIVO PONTO_MONTAGEM",
    "description": "Conecta um sistema de arquivos ou partição de disco a um diretório da árvore do Linux.",
    "options": [
      "-t TIPO            Especifica o tipo do sistema de arquivos (ex: ext4, nfs)"
    ],
    "examples": [
      "mount /dev/sda1 /mnt"
    ]
  },
  "umount": {
    "section": "8",
    "short": "desmonta um sistema de arquivos montado anteriormente",
    "synopsis": "umount [OPÇÕES] PONTO_MONTAGEM|DISPOSITIVO",
    "description": "Desconecta o sistema de arquivos especificado garantindo a gravação de todos os dados pendentes em disco.",
    "options": [],
    "examples": [
      "umount /mnt"
    ]
  },
  "nohup": {
    "section": "1",
    "short": "executa um comando imune a sinais de desligamento de terminal (SIGHUP)",
    "synopsis": "nohup COMANDO [ARGUMENTOS...] [&]",
    "description": "Permite que processos em segundo plano continuem em execução mesmo após o fechamento da janela do terminal ou logout.",
    "options": [],
    "examples": [
      "nohup ./script.sh &"
    ]
  },
  "jobs": {
    "section": "1",
    "short": "lista os trabalhos (jobs) em execução ou suspensos na sessão atual do shell",
    "synopsis": "jobs [OPÇÕES]",
    "description": "Exibe os programas iniciados em segundo plano (&) ou pausados com Ctrl+Z.",
    "options": [
      "-l                 Exibe os números de PID dos processos"
    ],
    "examples": [
      "jobs"
    ]
  },
  "fg": {
    "section": "1",
    "short": "traz um trabalho em segundo plano ou pausado para o primeiro plano (foreground)",
    "synopsis": "fg [%NÚMERO_JOB]",
    "description": "Restaura a execução de um processo em primeiro plano no terminal.",
    "options": [],
    "examples": [
      "fg",
      "fg %1"
    ]
  },
  "bg": {
    "section": "1",
    "short": "retoma a execução de um trabalho pausado em segundo plano (background)",
    "synopsis": "bg [%NÚMERO_JOB]",
    "description": "Faz com que um trabalho suspenso continue sendo executado em segundo plano sem prender o prompt.",
    "options": [],
    "examples": [
      "bg",
      "bg %1"
    ]
  },
  "type": {
    "section": "1",
    "short": "descreve como um nome de comando seria interpretado pelo shell",
    "synopsis": "type [-a] NOME...",
    "description": "Indica se um comando é um programa binário externo, um comando interno (builtin) do shell, um alias ou uma função.",
    "options": [
      "-a                 Exibe todas as ocorrências encontradas no PATH"
    ],
    "examples": [
      "type ls",
      "type cd",
      "type alias"
    ]
  },
  "builtin": {
    "section": "1",
    "short": "executa um comando interno do shell ignorando funções ou programas no PATH",
    "synopsis": "builtin COMANDO_INTERNO [ARGUMENTOS...]",
    "description": "Garante que o comando executado seja a versão embutida nativa do shell.",
    "options": [],
    "examples": [
      "builtin echo \"Olá\""
    ]
  },
  "command": {
    "section": "1",
    "short": "executa um comando simples ignorando aliases e funções do shell",
    "synopsis": "command [-v] COMANDO [ARGUMENTOS...]",
    "description": "Chama o comando original ignorando qualquer apelido configurado com alias.",
    "options": [
      "-v                 Equivale ao comando which"
    ],
    "examples": [
      "command ls"
    ]
  },
  "true": {
    "section": "1",
    "short": "retorna com sucesso (código de saída 0)",
    "synopsis": "true",
    "description": "Não faz nada além de retornar o código de saída 0 indicando êxito.",
    "options": [],
    "examples": [
      "true",
      "true && echo \"Sucesso\""
    ]
  },
  "false": {
    "section": "1",
    "short": "retorna com erro (código de saída 1)",
    "synopsis": "false",
    "description": "Não faz nada além de retornar o código de saída 1 indicando falha.",
    "options": [],
    "examples": [
      "false || echo \"Falhou\""
    ]
  },
  "printf": {
    "section": "1",
    "short": "formata e imprime dados de texto com especificadores de formato",
    "synopsis": "printf FORMATO [ARGUMENTOS...]",
    "description": "Imprime texto formatado com suporte a especificadores (%s, %d, %x) e sequências de escape (\\n, \\t).",
    "options": [],
    "examples": [
      "printf \"Usuário: %s\\n\" \"$USER\""
    ]
  },
  "vim": {
    "section": "1",
    "short": "Vi IMproved - editor de texto visual poderoso e extensível",
    "synopsis": "vim [OPÇÕES] [ARQUIVO...]",
    "description": "Versão aprimorada do editor de texto vi com suporte a realce de sintaxe, múltiplos modos (normal, inserção, comando) e edição eficiente.",
    "options": [],
    "examples": [
      "vim script.sh"
    ]
  },
  "vi": {
    "section": "1",
    "short": "editor de texto orientado a modos clássico do Unix/Linux",
    "synopsis": "vi [ARQUIVO...]",
    "description": "Editor de texto padrão universal presente em todos os sistemas Unix/Linux.",
    "options": [],
    "examples": [
      "vi config.txt"
    ]
  },
  "reset-fs": {
    "section": "1",
    "short": "limpa arquivos acumulados e restaura o ambiente ao ponto inicial",
    "synopsis": "reset-fs",
    "description": "Restaura o sistema de arquivos virtual e ferramentas (Git, Docker, SQLite) para o ponto inicial limpo, removendo arquivos criados em lições anteriores e mantendo seu progresso intacto.",
    "options": [],
    "examples": [
      "reset-fs"
    ]
  },
  "bc": {
    "section": "1",
    "short": "calculadora aritmética de precisão arbitrária",
    "synopsis": "echo \"expressão\" | bc",
    "description": "Avalia expressões matemáticas via entrada padrão ou argumento.",
    "options": [],
    "examples": ["echo \"10 * 5 + 2\" | bc"]
  },
  "cksum": {
    "section": "1",
    "short": "calcula soma de verificação CRC e contagem de bytes",
    "synopsis": "cksum [ARQUIVO...]",
    "description": "Calcula e imprime o checksum CRC e o número de bytes de cada arquivo.",
    "options": [],
    "examples": ["cksum documents/readme.txt"]
  },
  "route": {
    "section": "8",
    "short": "exibe ou manipula a tabela de roteamento IP",
    "synopsis": "route [-n]",
    "description": "Utilitário clássico para consultar a tabela de roteamento do kernel.",
    "options": ["-n  Exibe endereços numéricos em vez de resolver nomes"],
    "examples": ["route -n"]
  },
  "tracepath": {
    "section": "8",
    "short": "rastreia o caminho até um host descobrindo o MTU",
    "synopsis": "tracepath DESTINO",
    "description": "Rastreia os saltos de rede até o destino sem precisar de privilégios root.",
    "options": [],
    "examples": ["tracepath penguin-gym.com"]
  },
  "telnet": {
    "section": "1",
    "short": "cliente de conexão TCP interativa",
    "synopsis": "telnet HOST [PORTA]",
    "description": "Abre conexão TCP com host e porta especificados.",
    "options": [],
    "examples": ["telnet localhost 80"]
  },
  "iptables": {
    "section": "8",
    "short": "ferramenta de administração de regras de firewall IPv4",
    "synopsis": "sudo iptables [-L | -A | -D] ...",
    "description": "Gerencia tabelas de filtragem de pacotes no kernel Linux.",
    "options": ["-L  Lista todas as regras da cadeia atual"],
    "examples": ["sudo iptables -L"]
  },
  "nftables": {
    "section": "8",
    "short": "sucessor moderno do iptables para filtragem de pacotes",
    "synopsis": "sudo nftables [opções]",
    "description": "Framework de filtragem de pacotes e NAT do kernel Linux.",
    "options": [],
    "examples": ["sudo nftables"]
  },
  "fdisk": {
    "section": "8",
    "short": "manipulador de tabela de partições de disco",
    "synopsis": "sudo fdisk -l [DISPOSITIVO]",
    "description": "Exibe e edita tabelas de partições MBR/GPT dos discos do sistema.",
    "options": ["-l  Lista as tabelas de partições disponíveis"],
    "examples": ["sudo fdisk -l"]
  },
  "blkid": {
    "section": "8",
    "short": "localiza e imprime atributos e UUIDs de dispositivos de bloco",
    "synopsis": "blkid [DISPOSITIVO]",
    "description": "Exibe UUID, sistema de arquivos e PARTUUID de partições.",
    "options": [],
    "examples": ["blkid"]
  },
  "vmstat": {
    "section": "8",
    "short": "relata estatísticas de memória virtual, processos e CPU",
    "synopsis": "vmstat [INTERVALO]",
    "description": "Monitora memória livre, swap, I/O de disco, interrupções e uso de CPU.",
    "options": [],
    "examples": ["vmstat"]
  },
  "reboot": {
    "section": "8",
    "short": "reinicia o sistema operacional",
    "synopsis": "sudo reboot",
    "description": "Solicita reinicialização limpa do sistema (requer privilégios root).",
    "options": [],
    "examples": ["sudo reboot"]
  },
  "shutdown": {
    "section": "8",
    "short": "desliga ou reinicia o sistema com segurança",
    "synopsis": "sudo shutdown [-r | -h] [agora]",
    "description": "Encerra serviços e desliga/reinicia o sistema operacional.",
    "options": ["-r  Reinicia após desligar", "-h  Desliga o sistema"],
    "examples": ["sudo shutdown -r now"]
  }
};

function formatManPage(cmdName) {
  const clean = (cmdName || '').replace(/^-+/, '').toLowerCase();
  const page = MAN_PAGES[clean];
  if (!page) return null;

  const upper = clean.toUpperCase();
  const header = `${upper}(${page.section})                   Manual de Comandos Linux                   ${upper}(${page.section})`;
  const lines = [
    `\x1b[36m${header}\x1b[0m`,
    '',
    `\x1b[33mNOME\x1b[0m`,
    `       ${clean} - ${page.short}`,
    '',
    `\x1b[33mSINOPSE\x1b[0m`,
    `       ${page.synopsis}`,
    '',
    `\x1b[33mDESCRIÇÃO\x1b[0m`,
    `       ${page.description}`
  ];

  if (page.options && page.options.length > 0) {
    lines.push('', `\x1b[33mOPÇÕES\x1b[0m`);
    page.options.forEach(opt => lines.push(`       ${opt}`));
  }

  if (page.examples && page.examples.length > 0) {
    lines.push('', `\x1b[33mEXEMPLOS\x1b[0m`);
    page.examples.forEach(ex => lines.push(`       ${ex}`));
  }

  lines.push('', `\x1b[36mPenguin Gym Linux 6.1                 2026                             ${upper}(${page.section})\x1b[0m`);
  return lines.join('\n');
}

if (typeof window !== 'undefined') {
  window.MAN_PAGES = MAN_PAGES;
  window.formatManPage = formatManPage;
}
if (typeof globalThis !== 'undefined') {
  globalThis.MAN_PAGES = MAN_PAGES;
  globalThis.formatManPage = formatManPage;
}
