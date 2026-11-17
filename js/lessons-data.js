const LESSON_CATEGORIES = [
  {
    "id": "beginner",
    "label": "Iniciante",
    "icon": "🌱"
  },
  {
    "id": "fundamentals",
    "label": "Fundamentos",
    "icon": "📁"
  },
  {
    "id": "sysadmin",
    "label": "Sysadmin",
    "icon": "🛡️"
  },
  {
    "id": "advanced",
    "label": "Avançado",
    "icon": "⚡"
  },
  {
    "id": "lpic",
    "label": "LPIC-1",
    "icon": "🐧"
  },
  {
    "id": "git",
    "label": "Git",
    "icon": "🔀"
  },
  {
    "id": "docker",
    "label": "Docker",
    "icon": "🐳"
  },
  {
    "id": "scripting",
    "label": "Scripts",
    "icon": "📜"
  },
  {
    "id": "networking",
    "label": "Redes",
    "icon": "🌐"
  },
  {
    "id": "database",
    "label": "SQL",
    "icon": "🗄️"
  },
  {
    "id": "automation-bash",
    "label": "Auto Bash",
    "icon": "🤖"
  },
  {
    "id": "ansible",
    "label": "Ansible",
    "icon": "⚙️"
  },
  {
    "id": "incidents",
    "label": "Incidentes",
    "icon": "🚨"
  }
];

const ALL_LESSONS = [
  {
    "id": "basic-pwd",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o diretório atual",
    "description": "Exiba o caminho do diretório de trabalho atual.",
    "hint": "Use o comando pwd",
    "answer": "pwd",
    "answerSteps": [
      "pwd"
    ],
    "relatedCommands": [
      "pwd",
      "cd",
      "ls"
    ]
  },
  {
    "id": "basic-ls",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir a lista de arquivos",
    "description": "Exiba a lista de arquivos e pastas no diretório atual.",
    "hint": "Use o comando ls",
    "answer": "ls",
    "answerSteps": [
      "ls"
    ],
    "relatedCommands": [
      "ls",
      "ls -l",
      "ls -a",
      "pwd"
    ]
  },
  {
    "id": "basic-ls-all",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir incluindo arquivos ocultos",
    "description": "Exiba todos os arquivos, incluindo os ocultos (arquivos que começam com .).\nObservação: use o mínimo de opções necessárias.",
    "hint": "Adicione a opção -a ao comando ls",
    "answer": "ls -a",
    "answerSteps": [
      "ls -a"
    ],
    "relatedCommands": [
      "ls",
      "pwd"
    ]
  },
  {
    "id": "basic-cd-home",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Ir para o diretório home",
    "description": "Vá para o diretório home.",
    "hint": "Execute o comando cd sem argumentos ou use cd ~",
    "answer": "cd ~",
    "answerSteps": [
      "cd ~"
    ],
    "relatedCommands": [
      "cd",
      "pwd"
    ]
  },
  {
    "id": "basic-cd-parent",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Ir para o diretório pai",
    "description": "Vá para o diretório documents e depois volte ao diretório pai (um nível acima).",
    "hint": "Primeiro vá com cd documents e depois volte com cd ..",
    "answer": "cd documents && cd ..",
    "answerSteps": [
      "cd documents",
      "cd .."
    ],
    "relatedCommands": [
      "cd",
      "pwd"
    ]
  },
  {
    "id": "basic-whoami",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o nome do usuário atual",
    "description": "Exiba o nome do usuário atualmente conectado.",
    "hint": "Use o comando whoami",
    "answer": "whoami",
    "answerSteps": [
      "whoami"
    ],
    "relatedCommands": [
      "whoami",
      "pwd"
    ]
  },
  {
    "id": "basic-date",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir a data e hora atuais",
    "description": "Exiba a data e a hora atuais.",
    "hint": "Use o comando date",
    "answer": "date",
    "answerSteps": [
      "date"
    ],
    "relatedCommands": [
      "date",
      "echo"
    ]
  },
  {
    "id": "basic-echo",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir texto",
    "description": "Exiba o texto \"Hello Linux\".",
    "hint": "Use o comando echo",
    "answer": "echo \"Hello Linux\"",
    "answerSteps": [
      "echo \"Hello Linux\""
    ],
    "relatedCommands": [
      "echo",
      "date"
    ]
  },
  {
    "id": "basic-clear",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Limpar a tela",
    "description": "Limpe o conteúdo exibido no terminal.",
    "hint": "Use o comando clear",
    "answer": "clear",
    "answerSteps": [
      "clear"
    ],
    "relatedCommands": [
      "clear"
    ]
  },
  {
    "id": "basic-help",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir a ajuda",
    "description": "Exiba a lista de comandos disponíveis.",
    "hint": "Use o comando help",
    "answer": "help",
    "answerSteps": [
      "help"
    ],
    "relatedCommands": [
      "help"
    ]
  },
  {
    "id": "system-which",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Verificar a localização de um comando",
    "description": "Verifique onde o comando ls está armazenado no sistema.",
    "hint": "Use o comando which",
    "answer": "which ls",
    "answerSteps": [
      "which ls"
    ],
    "relatedCommands": [
      "which",
      "ls"
    ]
  },
  {
    "id": "system-which-grep",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Verificar a localização do comando grep",
    "description": "Descubra onde está o executável do comando grep.",
    "hint": "Use o comando which",
    "answer": "which grep",
    "answerSteps": [
      "which grep"
    ],
    "relatedCommands": [
      "which",
      "grep"
    ]
  },
  {
    "id": "text-head-basic",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o início de um arquivo",
    "description": "Exiba a parte inicial do arquivo documents/notes.txt.",
    "hint": "Use o comando head (exemplo: head documents/notes.txt)",
    "answer": "head documents/notes.txt",
    "answerSteps": [
      "head documents/notes.txt"
    ],
    "relatedCommands": [
      "head",
      "tail",
      "cat"
    ]
  },
  {
    "id": "text-tail-basic",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o final de um arquivo",
    "description": "Exiba a parte final do arquivo documents/notes.txt.",
    "hint": "Use o comando tail (exemplo: tail documents/notes.txt)",
    "answer": "tail documents/notes.txt",
    "answerSteps": [
      "tail documents/notes.txt"
    ],
    "relatedCommands": [
      "tail",
      "head",
      "cat"
    ]
  },
  {
    "id": "text-wc-lines",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Contar o número de linhas de um arquivo",
    "description": "Exiba o número de linhas do arquivo documents/notes.txt.",
    "hint": "Use o comando wc -l (exemplo: wc -l documents/notes.txt)",
    "answer": "wc -l documents/notes.txt",
    "answerSteps": [
      "wc -l documents/notes.txt"
    ],
    "relatedCommands": [
      "wc",
      "head",
      "tail"
    ]
  },
  {
    "id": "text-sort-basic",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Ordenar o conteúdo de um arquivo",
    "description": "Ordene o conteúdo do arquivo documents/data.txt em ordem alfabética e exiba.",
    "hint": "Use o comando sort (exemplo: sort documents/data.txt)",
    "answer": "sort documents/data.txt",
    "answerSteps": [
      "sort documents/data.txt"
    ],
    "relatedCommands": [
      "sort",
      "uniq",
      "cat"
    ]
  },
  {
    "id": "advanced-ls-size-format",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o tamanho dos arquivos em formato legível",
    "description": "Exiba o tamanho dos arquivos em um formato legível, como KB, MB etc.",
    "hint": "Combine a opção -h com -l (exemplo: ls -lh, ls -lah etc.)",
    "answer": "ls -lh",
    "answerSteps": [
      "ls -lh"
    ],
    "relatedCommands": [
      "ls"
    ]
  },
  {
    "id": "system-env-variables",
    "category": "beginner",
    "categoryLabel": "Iniciante",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Verificar variáveis de ambiente",
    "description": "Exiba as variáveis de ambiente do sistema e verifique a variável PATH.",
    "hint": "Use o comando env",
    "answer": "env",
    "answerSteps": [
      "env"
    ],
    "relatedCommands": [
      "env"
    ]
  },
  {
    "id": "file-mkdir",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar um diretório",
    "description": "Crie um novo diretório com o nome \"myproject\".",
    "hint": "Use o comando mkdir",
    "answer": "mkdir myproject",
    "answerSteps": [
      "mkdir myproject"
    ],
    "relatedCommands": [
      "mkdir",
      "touch"
    ]
  },
  {
    "id": "file-mkdir-p",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar diretórios aninhados de uma vez",
    "description": "Crie toda a hierarquia de pastas \"projeto/src/utils\" em um único comando, mesmo que os diretórios pais ainda não existam.",
    "hint": "Use a opção -p do mkdir: mkdir -p projeto/src/utils",
    "answer": "mkdir -p projeto/src/utils",
    "answerSteps": [
      "mkdir -p projeto/src/utils"
    ],
    "relatedCommands": [
      "mkdir"
    ]
  },
  {
    "id": "file-touch",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar um arquivo",
    "description": "Crie um arquivo vazio com o nome \"test.txt\".",
    "hint": "Use o comando touch",
    "answer": "touch test.txt",
    "answerSteps": [
      "touch test.txt"
    ],
    "relatedCommands": [
      "touch",
      "mkdir"
    ]
  },
  {
    "id": "file-cp",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Copiar um arquivo",
    "description": "Copie documents/readme.txt com o nome backup.txt.",
    "hint": "Use o comando cp",
    "answer": "cp documents/readme.txt backup.txt",
    "answerSteps": [
      "cp documents/readme.txt backup.txt"
    ],
    "relatedCommands": [
      "cp",
      "mv"
    ]
  },
  {
    "id": "file-mv-rename",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Renomear um arquivo com mv",
    "description": "Renomeie o arquivo \"test.txt\" no diretório atual para \"renomeado.txt\".",
    "hint": "No Linux, mover no mesmo diretório renomeia o arquivo: mv test.txt renomeado.txt",
    "answer": "mv test.txt renomeado.txt",
    "answerSteps": [
      "mv test.txt renomeado.txt"
    ],
    "relatedCommands": [
      "mv"
    ]
  },
  {
    "id": "file-cat",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o conteúdo de um arquivo",
    "description": "Exiba o conteúdo do arquivo documents/readme.txt.",
    "hint": "Use o comando cat",
    "answer": "cat documents/readme.txt",
    "answerSteps": [
      "cat documents/readme.txt"
    ],
    "relatedCommands": [
      "cat",
      "less",
      "head"
    ]
  },
  {
    "id": "file-more",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exibir o conteúdo do arquivo com rolagem",
    "description": "Exiba o arquivo documents/readme.txt rolando o conteúdo.",
    "hint": "Use o comando more",
    "answer": "more documents/readme.txt",
    "answerSteps": [
      "more documents/readme.txt"
    ],
    "relatedCommands": [
      "more",
      "less"
    ]
  },
  {
    "id": "tool-nano-edit",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": "103.8",
    "title": "Editar arquivo de texto no terminal",
    "description": "Abra o editor de texto padrão do terminal para criar ou modificar o arquivo 'script.sh', digite algum conteúdo (ex: echo \"ok\") e grave com Ctrl+O (^O).",
    "hint": "Execute nano script.sh, digite uma linha no editor e clique em '^O Gravar' (ou pressione Ctrl+O)",
    "answer": "nano script.sh",
    "answerSteps": [
      "nano script.sh"
    ],
    "relatedCommands": [
      "nano",
      "vim",
      "vi"
    ]
  },
  {
    "id": "tool-man-page",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Consultar página de manual de um comando",
    "description": "Abra a documentação e manual de instruções do comando 'grep' diretamente no visualizador do shell.",
    "hint": "Execute man grep",
    "answer": "man grep",
    "answerSteps": [
      "man grep"
    ],
    "relatedCommands": [
      "man",
      "whatis",
      "apropos",
      "help"
    ]
  },
  {
    "id": "tool-whatis",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Consultar descrição resumida de um comando",
    "description": "Obtenha uma explicação de apenas uma linha sobre o propósito da ferramenta 'tar'.",
    "hint": "Execute whatis tar",
    "answer": "whatis tar",
    "answerSteps": [
      "whatis tar"
    ],
    "relatedCommands": [
      "whatis",
      "man -f",
      "apropos"
    ]
  },
  {
    "id": "tool-apropos",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Pesquisar comandos no manual por palavra-chave",
    "description": "Pesquise em todas as páginas de documentação referências de comandos relacionadas à palavra-chave 'rede'.",
    "hint": "Execute apropos rede",
    "answer": "apropos rede",
    "answerSteps": [
      "apropos rede"
    ],
    "relatedCommands": [
      "apropos",
      "man -k",
      "whatis"
    ]
  },
  {
    "id": "tool-neofetch",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Iniciante",
    "lpicObjective": "101.1",
    "title": "Exibir painel visual e resumo do sistema",
    "description": "Exiba o resumo estilizado do sistema operacional contendo as informações de hardware, kernel e arte ASCII da distribuição.",
    "hint": "Execute o comando neofetch",
    "answer": "neofetch",
    "answerSteps": [
      "neofetch"
    ],
    "relatedCommands": [
      "neofetch",
      "uname -a",
      "hostnamectl"
    ]
  },
  {
    "id": "file-echo-write",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Escrever em um arquivo",
    "description": "Escreva o texto \"Hello World\" no arquivo \"hello.txt\".\nObservação: o nome do arquivo deve ser exatamente hello.txt.",
    "hint": "echo \"Hello World\" > hello.txt ou echo Hello World > hello.txt",
    "answer": "echo \"Hello World\" > hello.txt",
    "answerSteps": [
      "echo \"Hello World\" > hello.txt"
    ],
    "relatedCommands": [
      "echo",
      "cat"
    ]
  },
  {
    "id": "file-cp-dir",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Copiar um diretório recursivamente",
    "description": "Faça uma cópia completa da pasta documents (incluindo todos os arquivos dentro dela) para \"documents_backup\".",
    "hint": "Para copiar diretórios com cp, adicione a opção recursiva -r: cp -r documents documents_backup",
    "answer": "cp -r documents documents_backup",
    "answerSteps": [
      "cp -r documents documents_backup"
    ],
    "relatedCommands": [
      "cp"
    ]
  },
  {
    "id": "file-mv",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Mover um arquivo",
    "description": "Mova projects/test.sh para o diretório downloads.",
    "hint": "Use o comando mv",
    "answer": "mv projects/test.sh downloads",
    "answerSteps": [
      "mv projects/test.sh downloads"
    ],
    "relatedCommands": [
      "mv",
      "cp"
    ]
  },
  {
    "id": "file-rm",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Excluir um arquivo",
    "description": "Exclua o arquivo documents/notes.txt.",
    "hint": "Use o comando rm",
    "answer": "rm documents/notes.txt",
    "answerSteps": [
      "rm documents/notes.txt"
    ],
    "relatedCommands": [
      "rm",
      "rmdir"
    ]
  },
  {
    "id": "file-rmdir",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Excluir um diretório vazio",
    "description": "Exclua o diretório downloads (após confirmar que está vazio).",
    "hint": "Use o comando rmdir (ou rm -r)",
    "answer": "rmdir downloads",
    "answerSteps": [
      "rmdir downloads"
    ],
    "relatedCommands": [
      "rmdir",
      "rm"
    ]
  },
  {
    "id": "file-rm-recursive",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Excluir diretório com arquivos dentro",
    "description": "Exclua a pasta \"pasta_antiga\" e todo o seu conteúdo de forma recursiva.",
    "hint": "rmdir só apaga pastas vazias; para pastas com arquivos use rm -r pasta_antiga",
    "answer": "rm -r pasta_antiga",
    "answerSteps": [
      "rm -r pasta_antiga"
    ],
    "relatedCommands": [
      "rm",
      "rmdir"
    ]
  },
  {
    "id": "file-less",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o arquivo página por página",
    "description": "Exiba o arquivo documents/notes.txt página por página.",
    "hint": "Use o comando less. Barra de espaço para a próxima página, q para sair",
    "answer": "less documents/notes.txt",
    "answerSteps": [
      "less documents/notes.txt"
    ],
    "relatedCommands": [
      "less",
      "more"
    ]
  },
  {
    "id": "file-grep",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Buscar dentro de um arquivo",
    "description": "Busque e exiba as linhas que contêm \"Linux\" em documents/readme.txt.",
    "hint": "Use o comando grep",
    "answer": "grep Linux documents/readme.txt",
    "answerSteps": [
      "grep Linux documents/readme.txt"
    ],
    "relatedCommands": [
      "grep",
      "find"
    ]
  },
  {
    "id": "advanced-grep-ignore-case",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Busca textual ignorando maiúsculas e minúsculas",
    "description": "Busque a palavra \"linux\" no arquivo documents/readme.txt de forma insensível a maiúsculas e minúsculas, usando o mínimo de opções.",
    "hint": "Use o comando grep -i",
    "answer": "grep -i linux documents/readme.txt",
    "answerSteps": [
      "grep -i linux documents/readme.txt"
    ],
    "relatedCommands": [
      "grep"
    ]
  },
  {
    "id": "advanced-grep-invert",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Filtrar linhas que NÃO contêm um termo",
    "description": "Exiba apenas as linhas do arquivo dados.txt que NÃO contêm a palavra \"inativo\" (mostrando somente os servidores ativos).",
    "hint": "Use a opção -v (invert-match) do grep: grep -v inativo dados.txt",
    "answer": "grep -v inativo dados.txt",
    "answerSteps": [
      "grep -v inativo dados.txt"
    ],
    "relatedCommands": [
      "grep"
    ]
  },
  {
    "id": "advanced-cat-line-numbers",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir arquivo numerando as linhas",
    "description": "Exiba todo o conteúdo do arquivo documents/notes.txt com os números de cada linha no início.",
    "hint": "Use o comando cat -n",
    "answer": "cat -n documents/notes.txt",
    "answerSteps": [
      "cat -n documents/notes.txt"
    ],
    "relatedCommands": [
      "cat"
    ]
  },
  {
    "id": "advanced-cp-verbose",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Copiar arquivo exibindo detalhes da operação",
    "description": "Copie documents/readme.txt para backup.txt exibindo em detalhes cada etapa realizada pelo comando de cópia.",
    "hint": "Use o comando cp -v",
    "answer": "cp -v documents/readme.txt backup.txt",
    "answerSteps": [
      "cp -v documents/readme.txt backup.txt"
    ],
    "relatedCommands": [
      "cp"
    ]
  },
  {
    "id": "text-cut-fields",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Extrair campos para processar dados",
    "description": "Extraia apenas o primeiro campo do arquivo documents/notes.txt (separado por espaço).",
    "hint": "Use o comando cut -d \" \" -f 1",
    "answer": "cut -d \" \" -f 1 documents/notes.txt",
    "answerSteps": [
      "cut -d \" \" -f 1 documents/notes.txt"
    ],
    "relatedCommands": [
      "cut",
      "tr"
    ]
  },
  {
    "id": "text-tr-transform",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Processar texto com conversão de caracteres",
    "description": "Converta as letras minúsculas em maiúsculas do arquivo documents/readme.txt usando entrada padrão (stdin).",
    "hint": "No Linux real, o comando tr lê apenas via stdin: use tr \"a-z\" \"A-Z\" < documents/readme.txt ou cat documents/readme.txt | tr \"a-z\" \"A-Z\"",
    "answer": "tr \"a-z\" \"A-Z\" < documents/readme.txt",
    "answerSteps": [
      "tr \"a-z\" \"A-Z\" < documents/readme.txt"
    ],
    "relatedCommands": [
      "tr",
      "cut"
    ]
  },
  {
    "id": "text-head-lines",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir as N primeiras linhas",
    "description": "Exiba apenas as 2 primeiras linhas do arquivo documents/notes.txt.",
    "hint": "Use o comando head -n 2 (exemplo: head -n 2 documents/notes.txt)",
    "answer": "head -n 2 documents/notes.txt",
    "answerSteps": [
      "head -n 2 documents/notes.txt"
    ],
    "relatedCommands": [
      "head",
      "tail",
      "wc"
    ]
  },
  {
    "id": "text-tail-lines",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir as N últimas linhas",
    "description": "Exiba apenas as 2 últimas linhas do arquivo documents/notes.txt.",
    "hint": "Use o comando tail -n 2 (exemplo: tail -n 2 documents/notes.txt)",
    "answer": "tail -n 2 documents/notes.txt",
    "answerSteps": [
      "tail -n 2 documents/notes.txt"
    ],
    "relatedCommands": [
      "tail",
      "head",
      "wc"
    ]
  },
  {
    "id": "text-sort-reverse",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ordenar em ordem inversa",
    "description": "Ordene o conteúdo do arquivo documents/data.txt em ordem inversa (Z→A) e exiba.",
    "hint": "Use o comando sort -r (exemplo: sort -r documents/data.txt)",
    "answer": "sort -r documents/data.txt",
    "answerSteps": [
      "sort -r documents/data.txt"
    ],
    "relatedCommands": [
      "sort",
      "uniq"
    ]
  },
  {
    "id": "text-sort-numeric",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ordenar valores numéricos corretamente",
    "description": "Ordene o arquivo numeros.txt em ordem numérica crescente (2 antes de 100, e não em ordem alfabética).",
    "hint": "Sem -n, \"100\" vem antes de \"2\". Use sort -n numeros.txt",
    "answer": "sort -n numeros.txt",
    "answerSteps": [
      "sort -n numeros.txt"
    ],
    "relatedCommands": [
      "sort"
    ]
  },
  {
    "id": "text-uniq-basic",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover linhas duplicadas adjacentes",
    "description": "Remova as linhas duplicadas adjacentes do arquivo documents/data.txt e exiba.\nObservação: o uniq remove apenas repetições consecutivas; em arquivos desordenados, combine com sort antes.",
    "hint": "Use o comando uniq (exemplo: uniq documents/data.txt)",
    "answer": "uniq documents/data.txt",
    "answerSteps": [
      "uniq documents/data.txt"
    ],
    "relatedCommands": [
      "uniq",
      "sort",
      "cat"
    ]
  },
  {
    "id": "text-uniq-count",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o número de ocorrências das linhas duplicadas",
    "description": "Exiba o número de ocorrências de cada linha adjacente do arquivo documents/data.txt.\nDica prática: em arquivos reais desordenados, use sort arquivo | uniq -c.",
    "hint": "Use o comando uniq -c (exemplo: uniq -c documents/data.txt)",
    "answer": "uniq -c documents/data.txt",
    "answerSteps": [
      "uniq -c documents/data.txt"
    ],
    "relatedCommands": [
      "uniq",
      "sort"
    ]
  },
  {
    "id": "text-sort-uniq-combo",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ordenar antes de contar ocorrências com uniq",
    "description": "O arquivo bagunca.txt possui linhas repetidas fora de ordem. Ordene-o e conte quantas vezes cada item aparece usando pipeline.",
    "hint": "Combine sort e uniq -c com pipe: sort bagunca.txt | uniq -c",
    "answer": "sort bagunca.txt | uniq -c",
    "answerSteps": [
      "sort bagunca.txt | uniq -c"
    ],
    "relatedCommands": [
      "sort",
      "uniq"
    ]
  },
  {
    "id": "file-diff-comparison",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Comparar diferenças no conteúdo de arquivos",
    "description": "Compare o conteúdo de documents/readme.txt e documents/notes.txt.",
    "hint": "Use o comando diff",
    "answer": "diff documents/readme.txt documents/notes.txt",
    "answerSteps": [
      "diff documents/readme.txt documents/notes.txt"
    ],
    "relatedCommands": [
      "diff",
      "cat"
    ]
  },
  {
    "id": "permission-ls-l",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Verificar permissões de arquivo",
    "description": "Exiba as informações detalhadas dos arquivos (incluindo permissões).",
    "hint": "Use o comando ls -l (combinações com outras opções também são permitidas)",
    "answer": "ls -l",
    "answerSteps": [
      "ls -l"
    ],
    "relatedCommands": [
      "chmod",
      "ls"
    ]
  },
  {
    "id": "permission-chmod",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Alterar permissões de arquivo",
    "description": "Adicione permissão de execução ao arquivo test.txt.",
    "hint": "Use o comando chmod. Exemplo: chmod 755 ou chmod +x",
    "answer": "chmod +x test.txt",
    "answerSteps": [
      "chmod +x test.txt"
    ],
    "relatedCommands": [
      "chmod",
      "chown"
    ]
  },
  {
    "id": "permission-chmod-octal",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Definir permissões com modo octal",
    "description": "Proteja o arquivo \"segredo.txt\" deixando leitura e gravação apenas para o proprietário (600 em octal).",
    "hint": "600 equivale a rw------- (dono lê/escreve, grupo e outros sem acesso): chmod 600 segredo.txt",
    "answer": "chmod 600 segredo.txt",
    "answerSteps": [
      "chmod 600 segredo.txt"
    ],
    "relatedCommands": [
      "chmod",
      "ls -l"
    ]
  },
  {
    "id": "file-find",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Buscar arquivos",
    "description": "Busque arquivos que terminam com \".txt\" a partir do diretório atual.",
    "hint": "Use o comando find com a opção -name",
    "answer": "find . -name \"*.txt\"",
    "answerSteps": [
      "find . -name \"*.txt\""
    ],
    "relatedCommands": [
      "find",
      "grep"
    ]
  },
  {
    "id": "permission-chown",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Alterar o proprietário de um arquivo",
    "description": "Altere o proprietário do arquivo test.txt para \"admin\" utilizando privilégios de administrador (sudo).",
    "hint": "No Linux real, apenas root pode transferir propriedade de arquivo: use sudo chown admin test.txt",
    "answer": "sudo chown admin test.txt",
    "answerSteps": [
      "sudo chown admin test.txt"
    ],
    "relatedCommands": [
      "chown",
      "chmod"
    ]
  },
  {
    "id": "permission-sudo-basic",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Inspecionar diretório protegido do sistema",
    "description": "Verifique o conteúdo do diretório restrito '/root' utilizando privilégios de administrador.",
    "hint": "Use o comando sudo: sudo ls /root",
    "answer": "sudo ls /root",
    "answerSteps": [
      "sudo ls /root"
    ],
    "relatedCommands": [
      "sudo",
      "ls"
    ]
  },
  {
    "id": "permission-sudo-mkdir",
    "category": "fundamentals",
    "categoryLabel": "Fundamentos",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Criar pasta com permissões de administrador",
    "description": "Crie uma nova pasta chamada 'myfolder' dentro do diretório administrativo '/opt' utilizando privilégios de superusuário.",
    "hint": "Diretórios de sistema como /opt exigem root para escrita: use sudo mkdir /opt/myfolder",
    "answer": "sudo mkdir /opt/myfolder",
    "answerSteps": [
      "sudo mkdir /opt/myfolder"
    ],
    "relatedCommands": [
      "sudo",
      "mkdir"
    ]
  },
  {
    "id": "sys-systemctl-status",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "101.3",
    "title": "Inspecionar status do serviço web",
    "description": "Verifique se o serviço web \"nginx\" está ativo e em execução, conferindo seu PID e estado no gerenciador do sistema.",
    "hint": "Execute systemctl status nginx",
    "answer": "systemctl status nginx",
    "answerSteps": [
      "systemctl status nginx"
    ],
    "relatedCommands": [
      "systemctl",
      "systemctl status",
      "service",
      "journalctl"
    ]
  },
  {
    "id": "sys-systemctl-is-active",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "101.3",
    "title": "Checar de forma rápida se um serviço está ativo",
    "description": "Consulte de maneira objetiva o estado do serviço \"nginx\" para obter a confirmação direta se ele está ativo.",
    "hint": "Execute systemctl is-active nginx",
    "answer": "systemctl is-active nginx",
    "answerSteps": [
      "systemctl is-active nginx"
    ],
    "relatedCommands": [
      "systemctl is-active",
      "systemctl is-enabled",
      "systemctl status"
    ]
  },
  {
    "id": "sys-journalctl-lines",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "108.3",
    "title": "Consultar as entradas mais recentes do log do sistema",
    "description": "Exiba apenas as últimas 5 linhas registradas no diário de eventos do sistema.",
    "hint": "Execute journalctl -n 5",
    "answer": "journalctl -n 5",
    "answerSteps": [
      "journalctl -n 5"
    ],
    "relatedCommands": [
      "journalctl -n",
      "journalctl -f",
      "tail /var/log/syslog"
    ]
  },
  {
    "id": "sys-apt-update",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "102.4",
    "title": "Atualizar índice de repositórios de pacotes",
    "description": "Sincronize a lista de pacotes local com os servidores oficiais para obter as versões mais recentes disponíveis.",
    "hint": "Execute sudo apt update",
    "answer": "sudo apt update",
    "answerSteps": [
      "sudo apt update"
    ],
    "relatedCommands": [
      "sudo apt update",
      "sudo apt upgrade",
      "apt-get"
    ]
  },
  {
    "id": "sys-apt-search",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "102.4",
    "title": "Buscar pacotes disponíveis para instalação",
    "description": "Pesquise nos repositórios para descobrir pacotes relacionados ao utilitário de monitoramento \"htop\".",
    "hint": "Execute apt search htop",
    "answer": "apt search htop",
    "answerSteps": [
      "apt search htop"
    ],
    "relatedCommands": [
      "apt search",
      "apt show",
      "apt list",
      "dpkg"
    ]
  },
  {
    "id": "sys-apt-show",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "102.4",
    "title": "Inspecionar informações detalhadas de um pacote",
    "description": "Exiba versão, descrição completa, tamanho e mantenedor do pacote \"neofetch\" antes de instalá-lo.",
    "hint": "Execute apt show neofetch",
    "answer": "apt show neofetch",
    "answerSteps": [
      "apt show neofetch"
    ],
    "relatedCommands": [
      "apt show",
      "apt search",
      "dpkg -s"
    ]
  },
  {
    "id": "sys-free-human",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "106.1",
    "title": "Verificar consumo de memória do sistema",
    "description": "Exiba a memória RAM e memória Swap total, usada e disponível em formato legível para humanos (MB/GB).",
    "hint": "Execute free -h",
    "answer": "free -h",
    "answerSteps": [
      "free -h"
    ],
    "relatedCommands": [
      "free",
      "free -h",
      "free -m",
      "vmstat"
    ]
  },
  {
    "id": "sys-lscpu",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "101.1",
    "title": "Inspecionar arquitetura e dados do processador",
    "description": "Exiba os detalhes técnicos da CPU, incluindo arquitetura, número de núcleos e modelo.",
    "hint": "Execute lscpu",
    "answer": "lscpu",
    "answerSteps": [
      "lscpu"
    ],
    "relatedCommands": [
      "lscpu",
      "uname -m",
      "cat /proc/cpuinfo"
    ]
  },
  {
    "id": "sys-lsblk",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "104.1",
    "title": "Listar unidades de armazenamento e partições",
    "description": "Visualize a hierarquia de discos, volumes e seus pontos de montagem no sistema.",
    "hint": "Execute lsblk",
    "answer": "lsblk",
    "answerSteps": [
      "lsblk"
    ],
    "relatedCommands": [
      "lsblk",
      "fdisk -l",
      "df -h",
      "blkid"
    ]
  },
  {
    "id": "sys-id-user",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": "104.5",
    "title": "Identificar credenciais e grupos do usuário",
    "description": "Exiba o identificador de usuário (UID), identificador de grupo primário (GID) e os grupos aos quais o usuário pertence.",
    "hint": "Execute o comando id",
    "answer": "id",
    "answerSteps": [
      "id"
    ],
    "relatedCommands": [
      "id",
      "whoami",
      "groups",
      "getent passwd"
    ]
  },
  {
    "id": "sys-groups-check",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Consultar grupos de um usuário",
    "description": "Verifique a quais grupos a conta \"devops\" pertence no momento.",
    "hint": "Execute groups devops",
    "answer": "groups devops",
    "answerSteps": [
      "groups devops"
    ],
    "relatedCommands": [
      "groups",
      "id"
    ]
  },
  {
    "id": "system-uname",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Consultar versão do kernel e arquitetura",
    "description": "Exiba todas as informações do sistema operacional e versão do kernel Linux em execução.",
    "hint": "Execute uname -a",
    "answer": "uname -a",
    "answerSteps": [
      "uname -a"
    ],
    "relatedCommands": [
      "uname",
      "lscpu"
    ]
  },
  {
    "id": "system-uptime",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Verificar tempo de atividade e carga da máquina",
    "description": "Consulte há quanto tempo o servidor está ligado e a média de carga (load average).",
    "hint": "Execute uptime",
    "answer": "uptime",
    "answerSteps": [
      "uptime"
    ],
    "relatedCommands": [
      "uptime",
      "top"
    ]
  },
  {
    "id": "sys-sudo-root-session",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "103.1",
    "title": "Iniciar sessão interativa como superusuário",
    "description": "Abra uma sessão completa como administrador (root) com suas variáveis de ambiente e diretório apropriados.",
    "hint": "Execute sudo -i",
    "answer": "sudo -i",
    "answerSteps": [
      "sudo -i"
    ],
    "relatedCommands": [
      "sudo -i",
      "sudo su",
      "su -",
      "whoami"
    ]
  },
  {
    "id": "sys-session-exit",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "103.1",
    "title": "Encerrar sessão de usuário atual",
    "description": "Após iniciar uma sessão como superusuário ou subshell, finalize a sessão atual com exit para retornar ao usuário anterior.",
    "hint": "Execute exit (ou logout)",
    "answer": "exit",
    "answerSteps": [
      "exit"
    ],
    "relatedCommands": [
      "exit",
      "logout",
      "Ctrl+D"
    ]
  },
  {
    "id": "sys-systemctl-restart",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "101.3",
    "title": "Reiniciar um serviço com systemctl",
    "description": "Com privilégios administrativos (sudo), reinicie o serviço web nginx para aplicar alterações de configuração.",
    "hint": "Execute sudo systemctl restart nginx",
    "answer": "sudo systemctl restart nginx",
    "answerSteps": [
      "sudo systemctl restart nginx"
    ],
    "relatedCommands": [
      "sudo systemctl restart",
      "sudo systemctl start",
      "sudo systemctl stop"
    ]
  },
  {
    "id": "sys-systemctl-enable",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "101.3",
    "title": "Habilitar serviço na inicialização do boot",
    "description": "Configure o serviço nginx para iniciar automaticamente durante o processo de boot do sistema operacional com systemctl.",
    "hint": "Execute sudo systemctl enable nginx",
    "answer": "sudo systemctl enable nginx",
    "answerSteps": [
      "sudo systemctl enable nginx"
    ],
    "relatedCommands": [
      "sudo systemctl enable",
      "sudo systemctl disable",
      "systemctl is-enabled"
    ]
  },
  {
    "id": "sys-systemctl-stop",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Interromper um serviço ativo",
    "description": "Pare a execução do serviço web \"nginx\" imediatamente com systemctl.",
    "hint": "Execute sudo systemctl stop nginx",
    "answer": "sudo systemctl stop nginx",
    "answerSteps": [
      "sudo systemctl stop nginx"
    ],
    "relatedCommands": [
      "systemctl"
    ]
  },
  {
    "id": "sys-systemctl-start",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Iniciar um serviço que está parado",
    "description": "O banco \"postgresql\" encontra-se inativo no sistema. Inicie o serviço usando systemctl.",
    "hint": "Execute sudo systemctl start postgresql",
    "answer": "sudo systemctl start postgresql",
    "answerSteps": [
      "sudo systemctl start postgresql"
    ],
    "relatedCommands": [
      "systemctl"
    ]
  },
  {
    "id": "sys-systemctl-disable",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Desabilitar inicialização automática no boot",
    "description": "Remova o serviço \"nginx\" da inicialização automática durante o boot.",
    "hint": "Execute sudo systemctl disable nginx",
    "answer": "sudo systemctl disable nginx",
    "answerSteps": [
      "sudo systemctl disable nginx"
    ],
    "relatedCommands": [
      "systemctl"
    ]
  },
  {
    "id": "sys-journalctl-unit",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "108.3",
    "title": "Consultar histórico de logs de um serviço específico",
    "description": "Inspecione os registros de eventos e diagnósticos pertencentes exclusivamente ao serviço \"ssh\".",
    "hint": "Execute journalctl -u ssh",
    "answer": "journalctl -u ssh",
    "answerSteps": [
      "journalctl -u ssh"
    ],
    "relatedCommands": [
      "journalctl",
      "journalctl -u",
      "journalctl -xe",
      "dmesg"
    ]
  },
  {
    "id": "sys-apt-install",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "102.4",
    "title": "Instalar novo utilitário no sistema operacional",
    "description": "Instale o programa \"cowsay\" no sistema utilizando privilégios de administrador.",
    "hint": "Execute sudo apt install cowsay",
    "answer": "sudo apt install cowsay",
    "answerSteps": [
      "sudo apt install cowsay"
    ],
    "relatedCommands": [
      "sudo apt install",
      "sudo apt remove",
      "dpkg -i"
    ]
  },
  {
    "id": "sys-apt-upgrade",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Aplicar atualizações de pacotes do sistema",
    "description": "Após atualizar os índices com apt update, execute o comando que aplica as atualizações disponíveis nos pacotes instalados.",
    "hint": "Execute sudo apt upgrade",
    "answer": "sudo apt upgrade",
    "answerSteps": [
      "sudo apt upgrade"
    ],
    "relatedCommands": [
      "apt",
      "sudo"
    ]
  },
  {
    "id": "sys-apt-remove",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Desinstalar um pacote mantendo configurações",
    "description": "Remova o pacote \"cowsay\" que foi instalado anteriormente, mantendo eventuais arquivos de configuração.",
    "hint": "Execute sudo apt remove cowsay",
    "answer": "sudo apt remove cowsay",
    "answerSteps": [
      "sudo apt remove cowsay"
    ],
    "relatedCommands": [
      "apt"
    ]
  },
  {
    "id": "sys-apt-purge",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover completamente pacote e configurações",
    "description": "Desinstale o pacote \"cowsay\" apagando também os seus arquivos de configuração com purge.",
    "hint": "Execute sudo apt purge cowsay",
    "answer": "sudo apt purge cowsay",
    "answerSteps": [
      "sudo apt purge cowsay"
    ],
    "relatedCommands": [
      "apt"
    ]
  },
  {
    "id": "sys-apt-autoremove",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Limpar dependências órfãs não utilizadas",
    "description": "Execute a limpeza automática de pacotes dependentes que não são mais necessários no sistema.",
    "hint": "Execute sudo apt autoremove",
    "answer": "sudo apt autoremove",
    "answerSteps": [
      "sudo apt autoremove"
    ],
    "relatedCommands": [
      "apt"
    ]
  },
  {
    "id": "sys-dpkg-list",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "102.4",
    "title": "Listar todos os pacotes instalados",
    "description": "Consulte a base de dados de baixo nível para listar todos os pacotes de software instalados no sistema.",
    "hint": "Execute dpkg -l",
    "answer": "dpkg -l",
    "answerSteps": [
      "dpkg -l"
    ],
    "relatedCommands": [
      "dpkg -l",
      "dpkg -s",
      "apt list --installed"
    ]
  },
  {
    "id": "sys-dmesg",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "101.1",
    "title": "Consultar mensagens e diagnósticos do kernel",
    "description": "Exiba o buffer de mensagens e diagnósticos de hardware gerados pelo kernel durante o funcionamento do sistema.",
    "hint": "Execute dmesg",
    "answer": "dmesg",
    "answerSteps": [
      "dmesg"
    ],
    "relatedCommands": [
      "dmesg",
      "journalctl -k",
      "uname -a"
    ]
  },
  {
    "id": "sys-groupadd",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Criar um novo grupo de usuários",
    "description": "Crie um grupo de sistema chamado \"deploy\" para gerenciar permissões da equipe.",
    "hint": "Execute sudo groupadd deploy",
    "answer": "sudo groupadd deploy",
    "answerSteps": [
      "sudo groupadd deploy"
    ],
    "relatedCommands": [
      "groupadd"
    ]
  },
  {
    "id": "sys-useradd",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "107.1",
    "title": "Criar nova conta de usuário no sistema",
    "description": "Cadastre um novo usuário no sistema chamado \"devops\", assegurando que sua pasta pessoal (/home/devops) seja criada.",
    "hint": "Execute sudo useradd -m devops",
    "answer": "sudo useradd -m devops",
    "answerSteps": [
      "sudo useradd -m devops"
    ],
    "relatedCommands": [
      "sudo useradd -m",
      "sudo userdel -r",
      "passwd",
      "usermod"
    ]
  },
  {
    "id": "sys-usermod-group",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Adicionar usuário existente a um grupo",
    "description": "Adicione o usuário \"devops\" ao grupo secundário \"deploy\" sem remover seus grupos atuais (-aG).",
    "hint": "Execute sudo usermod -aG deploy devops",
    "answer": "sudo usermod -aG deploy devops",
    "answerSteps": [
      "sudo usermod -aG deploy devops"
    ],
    "relatedCommands": [
      "usermod",
      "groups"
    ]
  },
  {
    "id": "sys-passwd-user",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Definir ou alterar senha de um usuário",
    "description": "Atualize a senha da conta \"devops\" utilizando privilégios administrativos.",
    "hint": "Execute sudo passwd devops",
    "answer": "sudo passwd devops",
    "answerSteps": [
      "sudo passwd devops"
    ],
    "relatedCommands": [
      "passwd"
    ]
  },
  {
    "id": "sys-userdel",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Excluir usuário e sua pasta pessoal",
    "description": "Remova a conta \"devops\" do sistema apagando também seu diretório /home/devops (-r).",
    "hint": "Execute sudo userdel -r devops",
    "answer": "sudo userdel -r devops",
    "answerSteps": [
      "sudo userdel -r devops"
    ],
    "relatedCommands": [
      "userdel"
    ]
  },
  {
    "id": "sys-crontab-list",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": "107.2",
    "title": "Visualizar agendamentos de tarefas periódicas",
    "description": "Exiba a tabela de rotinas programadas do usuário atual para verificar quais scripts rodam automaticamente.",
    "hint": "Execute crontab -l",
    "answer": "crontab -l",
    "answerSteps": [
      "crontab -l"
    ],
    "relatedCommands": [
      "crontab -l",
      "crontab -e",
      "crontab -r",
      "at"
    ]
  },
  {
    "id": "sys-crontab-edit",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Editar agendamentos do crontab",
    "description": "Abra o editor do seu crontab pessoal com crontab -e, adicione uma nova rotina (ex: 0 4 * * * /bin/true) e grave com Ctrl+O (^O).",
    "hint": "Execute crontab -e, edite o texto e clique em '^O Gravar'",
    "answer": "crontab -e",
    "answerSteps": [
      "crontab -e"
    ],
    "relatedCommands": [
      "crontab"
    ]
  },
  {
    "id": "sys-crontab-remove",
    "category": "sysadmin",
    "categoryLabel": "Sysadmin",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover todas as tarefas agendadas do usuário",
    "description": "Limpe e exclua a tabela crontab atual do usuário usando a opção de remoção.",
    "hint": "Execute crontab -r",
    "answer": "crontab -r",
    "answerSteps": [
      "crontab -r"
    ],
    "relatedCommands": [
      "crontab"
    ]
  },
  {
    "id": "text-tree-view",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Visualizar hierarquia de diretórios em árvore",
    "description": "Exiba a estrutura completa de pastas e arquivos a partir do diretório atual em formato gráfico de árvore.",
    "hint": "Execute o comando tree",
    "answer": "tree",
    "answerSteps": [
      "tree"
    ],
    "relatedCommands": [
      "tree",
      "tree -L",
      "tree -d",
      "ls -R"
    ]
  },
  {
    "id": "process-ps",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir a lista de processos",
    "description": "Exiba a lista de processos em execução no momento.",
    "hint": "Use o comando ps",
    "answer": "ps aux",
    "answerSteps": [
      "ps aux"
    ],
    "relatedCommands": [
      "ps",
      "kill"
    ]
  },
  {
    "id": "process-top",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o estado do sistema",
    "description": "Exiba o estado em tempo real do sistema (uso de CPU, memória etc.).",
    "hint": "Use o comando top",
    "answer": "top",
    "answerSteps": [
      "top"
    ],
    "relatedCommands": [
      "top",
      "ps"
    ]
  },
  {
    "id": "process-df",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o uso de disco",
    "description": "Exiba o uso de disco do sistema de arquivos.",
    "hint": "Use o comando df",
    "answer": "df -h",
    "answerSteps": [
      "df -h"
    ],
    "relatedCommands": [
      "df",
      "du"
    ]
  },
  {
    "id": "process-du",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Exibir o tamanho do diretório",
    "description": "Exiba o tamanho do diretório atual e dos subdiretórios.",
    "hint": "Use o comando du",
    "answer": "du -h",
    "answerSteps": [
      "du -h"
    ],
    "relatedCommands": [
      "du",
      "df"
    ]
  },
  {
    "id": "process-du-summary",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Resumir o tamanho total de uma pasta",
    "description": "Exiba apenas o tamanho total resumido (em KB/MB legíveis) do diretório \"documents\", sem listar cada subpasta.",
    "hint": "Combine -s (summary) com -h: du -sh documents",
    "answer": "du -sh documents",
    "answerSteps": [
      "du -sh documents"
    ],
    "relatedCommands": [
      "du",
      "df"
    ]
  },
  {
    "id": "process-pgrep",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Buscar PID de um processo pelo nome",
    "description": "Encontre o PID e o nome do processo \"nginx\" sem precisar filtrar ps aux manualmente.",
    "hint": "Use pgrep com -l para mostrar PID e nome: pgrep -l nginx",
    "answer": "pgrep -l nginx",
    "answerSteps": [
      "pgrep -l nginx"
    ],
    "relatedCommands": [
      "pgrep",
      "ps"
    ]
  },
  {
    "id": "process-kill",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Encerrar um processo em execução",
    "description": "Finalize o processo nginx em execução de PID 123 enviando o sinal padrão de término.",
    "hint": "Confira o PID com ps aux e execute kill 123",
    "answer": "kill 123",
    "answerSteps": [
      "kill 123"
    ],
    "relatedCommands": [
      "kill",
      "ps"
    ]
  },
  {
    "id": "text-tree-depth",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Limitar profundidade da árvore de diretórios",
    "description": "Exiba a árvore hierárquica de pastas e arquivos limitando a exibição a no máximo 2 níveis de profundidade.",
    "hint": "Execute tree -L 2",
    "answer": "tree -L 2",
    "answerSteps": [
      "tree -L 2"
    ],
    "relatedCommands": [
      "tree -L",
      "tree -d",
      "find -maxdepth"
    ]
  },
  {
    "id": "text-column-format",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": "103.2",
    "title": "Formatar texto irregular em colunas alinhadas",
    "description": "Transforme o arquivo de texto desformatado 'dados.txt' em uma tabela visualmente alinhada em colunas legíveis.",
    "hint": "Execute column -t dados.txt",
    "answer": "column -t dados.txt",
    "answerSteps": [
      "column -t dados.txt"
    ],
    "relatedCommands": [
      "column -t",
      "paste",
      "awk"
    ]
  },
  {
    "id": "tool-jq-parse",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": "103.2",
    "title": "Formatar e indentar estrutura JSON",
    "description": "Processe e formate o conteúdo do arquivo 'config.json' exibindo a estrutura JSON indentada.",
    "hint": "Execute cat config.json | jq .",
    "answer": "cat config.json | jq .",
    "answerSteps": [
      "cat config.json | jq ."
    ],
    "relatedCommands": [
      "jq",
      "jq .",
      "curl | jq"
    ]
  },
  {
    "id": "text-jq-filter",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Extrair um campo específico de JSON com jq",
    "description": "Leia o arquivo config.json e extraia exclusivamente o valor da chave \"version\" usando jq.",
    "hint": "Execute cat config.json | jq .version (ou jq .version config.json)",
    "answer": "cat config.json | jq .version",
    "answerSteps": [
      "cat config.json | jq .version"
    ],
    "relatedCommands": [
      "jq"
    ]
  },
  {
    "id": "text-tee-pipe",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Intermediário",
    "lpicObjective": "103.4",
    "title": "Duplicar saída entre tela e arquivo",
    "description": "Liste os arquivos detalhados (formato longo) e faça com que o resultado seja exibido no terminal e gravado simultaneamente em 'relatorio.txt'.",
    "hint": "Execute ls -l | tee relatorio.txt",
    "answer": "ls -l | tee relatorio.txt",
    "answerSteps": [
      "ls -l | tee relatorio.txt"
    ],
    "relatedCommands": [
      "tee",
      "tee -a",
      ">",
      ">>"
    ]
  },
  {
    "id": "pipeline-ls-grep",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Filtrar listagem de arquivos com pipeline",
    "description": "Vá para a pasta documents e encadeie comandos via pipeline (|) para exibir apenas os arquivos que possuem a extensão \".txt\".",
    "hint": "Primeiro mude de diretório com \"cd documents\" e depois faça a busca com pipeline usando \"ls | grep .txt\"",
    "answer": "cd documents && ls | grep .txt",
    "answerSteps": [
      "cd documents",
      "ls | grep .txt"
    ],
    "relatedCommands": [
      "grep",
      "ls"
    ]
  },
  {
    "id": "redirect-output-basic",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Redirecionar a saída para um arquivo novo",
    "description": "Envie a mensagem de texto \"Linux Study Log\" para o arquivo study_log.txt, criando ou sobrescrevendo o arquivo.",
    "hint": "Use o redirecionamento no formato echo \"Linux Study Log\" > study_log.txt",
    "answer": "echo \"Linux Study Log\" > study_log.txt",
    "answerSteps": [
      "echo \"Linux Study Log\" > study_log.txt"
    ],
    "relatedCommands": [
      "echo"
    ]
  },
  {
    "id": "redirect-append-advanced",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Acrescentar informações ao final de um arquivo",
    "description": "Adicione a data e hora atuais ao final do arquivo study_log.txt, preservando o conteúdo que já estava nele.",
    "hint": "Use o redirecionamento de acréscimo no formato date >> study_log.txt",
    "answer": "date >> study_log.txt",
    "answerSteps": [
      "date >> study_log.txt"
    ],
    "relatedCommands": [
      "date"
    ]
  },
  {
    "id": "text-sed-replace",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": "103.2",
    "title": "Substituir termos em um fluxo de texto",
    "description": "Substitua todas as ocorrências da palavra \"Linux\" por \"GNU/Linux\" no arquivo documents/readme.txt exibindo o resultado no terminal.",
    "hint": "Execute sed 's/Linux/GNU\\/Linux/g' documents/readme.txt",
    "answer": "sed 's/Linux/GNU\\/Linux/g' documents/readme.txt",
    "answerSteps": [
      "sed 's/Linux/GNU\\/Linux/g' documents/readme.txt"
    ],
    "relatedCommands": [
      "sed",
      "sed -i",
      "awk",
      "tr"
    ]
  },
  {
    "id": "text-sed-inplace",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": "103.2",
    "title": "Modificar arquivo diretamente no disco",
    "description": "Altere a linha contendo \"versao=1\" para \"versao=2\" diretamente dentro de config.txt, sem abrir editores interativos.",
    "hint": "Execute sed -i 's/versao=1/versao=2/g' config.txt",
    "answer": "sed -i 's/versao=1/versao=2/g' config.txt",
    "answerSteps": [
      "sed -i 's/versao=1/versao=2/g' config.txt"
    ],
    "relatedCommands": [
      "sed -i",
      "sed",
      "awk"
    ]
  },
  {
    "id": "text-sed-delete",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Remover linhas correspondentes com sed",
    "description": "Exiba o conteúdo de dados.txt excluindo da saída todas as linhas que contenham a palavra \"inativo\".",
    "hint": "Use o comando /padrao/d no sed: sed '/inativo/d' dados.txt",
    "answer": "sed '/inativo/d' dados.txt",
    "answerSteps": [
      "sed '/inativo/d' dados.txt"
    ],
    "relatedCommands": [
      "sed"
    ]
  },
  {
    "id": "text-awk-columns",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": "103.2",
    "title": "Extrair colunas específicas de texto",
    "description": "Filtre e imprima apenas a primeira e a terceira coluna de dados do arquivo 'dados.txt'.",
    "hint": "Execute awk '{print $1, $3}' dados.txt",
    "answer": "awk '{print $1, $3}' dados.txt",
    "answerSteps": [
      "awk '{print $1, $3}' dados.txt"
    ],
    "relatedCommands": [
      "awk",
      "cut",
      "column"
    ]
  },
  {
    "id": "text-awk-delimiter",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": "103.2",
    "title": "Processar arquivo com delimitador personalizado",
    "description": "Processe o arquivo 'usuarios.csv' considerando a vírgula como separador de campos e imprima apenas a primeira coluna.",
    "hint": "Execute awk -F',' '{print $1}' usuarios.csv",
    "answer": "awk -F',' '{print $1}' usuarios.csv",
    "answerSteps": [
      "awk -F',' '{print $1}' usuarios.csv"
    ],
    "relatedCommands": [
      "awk -F",
      "cut -d",
      "column"
    ]
  },
  {
    "id": "text-awk-filter",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Filtrar linhas condicionalmente com awk",
    "description": "Processe o arquivo dados.txt e imprima apenas o nome (1ª coluna) dos servidores cujo status (3ª coluna) seja igual a \"ativo\".",
    "hint": "Execute awk '$3 == \"ativo\" {print $1}' dados.txt",
    "answer": "awk '$3 == \"ativo\" {print $1}' dados.txt",
    "answerSteps": [
      "awk '$3 == \"ativo\" {print $1}' dados.txt"
    ],
    "relatedCommands": [
      "awk"
    ]
  },
  {
    "id": "text-xargs-basic",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": "103.4",
    "title": "Transformar linhas de arquivo em argumentos de comando",
    "description": "Leia a lista de nomes presente em 'lista.txt' e use cada nome lido como argumento para criar os arquivos correspondentes de uma só vez.",
    "hint": "Execute cat lista.txt | xargs touch",
    "answer": "cat lista.txt | xargs touch",
    "answerSteps": [
      "cat lista.txt | xargs touch"
    ],
    "relatedCommands": [
      "xargs",
      "xargs -n",
      "find -exec"
    ]
  },
  {
    "id": "process-kill-sigkill",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Forçar encerramento imediato com SIGKILL",
    "description": "Quando um processo trava e ignora SIGTERM, envie o sinal -9 (SIGKILL) para forçar o encerramento do PID 123.",
    "hint": "Execute kill -9 123",
    "answer": "kill -9 123",
    "answerSteps": [
      "kill -9 123"
    ],
    "relatedCommands": [
      "kill",
      "ps"
    ]
  },
  {
    "id": "process-pkill",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Encerrar processos diretamente pelo nome",
    "description": "Finalize o processo \"nginx\" diretamente pelo seu nome sem precisar informar o PID numérico.",
    "hint": "Execute pkill nginx",
    "answer": "pkill nginx",
    "answerSteps": [
      "pkill nginx"
    ],
    "relatedCommands": [
      "pkill",
      "kill"
    ]
  },
  {
    "id": "process-jobs-bg",
    "category": "advanced",
    "categoryLabel": "Avançado",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Executar tarefa em background e listar jobs",
    "description": "Inicie o comando \"sleep 60\" em segundo plano usando & e depois liste as tarefas em segundo plano da sessão atual.",
    "hint": "Execute sleep 60 & e depois jobs",
    "answer": "sleep 60 & jobs",
    "answerSteps": [
      "sleep 60 &",
      "jobs"
    ],
    "relatedCommands": [
      "jobs",
      "fg",
      "bg"
    ]
  },
  {
    "id": "lpic-tar-list",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Inspecionar conteúdo de um arquivo empacotado (.tar)",
    "description": "Exiba a lista de arquivos contidos dentro do arquivo empacotado 'docs.tar' (tar apenas empacota; gzip comprime) sem extraí-los no disco.",
    "hint": "Execute tar -tf docs.tar",
    "answer": "tar -tf docs.tar",
    "answerSteps": [
      "tar -tf docs.tar"
    ],
    "relatedCommands": [
      "tar"
    ]
  },
  {
    "id": "lpic-gzip-compress",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Compactar arquivo individual",
    "description": "Reduza o tamanho do arquivo documents/notes.txt aplicando a compactação padrão do sistema.",
    "hint": "Use o comando gzip (exemplo: gzip documents/notes.txt)",
    "answer": "gzip documents/notes.txt",
    "answerSteps": [
      "gzip documents/notes.txt"
    ],
    "relatedCommands": [
      "gzip",
      "gunzip",
      "ls"
    ]
  },
  {
    "id": "lpic-gunzip-decompress",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Descompactar arquivo comprimido",
    "description": "Comprima documents/notes.txt e, em seguida, desfaça a compressão restaurando o arquivo de texto original.",
    "hint": "Após gzip documents/notes.txt, execute gunzip documents/notes.txt.gz",
    "answer": "gzip documents/notes.txt && gunzip documents/notes.txt.gz",
    "answerSteps": [
      "gzip documents/notes.txt",
      "gunzip documents/notes.txt.gz"
    ],
    "relatedCommands": [
      "gzip",
      "gunzip",
      "cat"
    ]
  },
  {
    "id": "lpic-zip-create",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Compactar diretório no formato .zip",
    "description": "Crie um arquivo compactado chamado \"proj.zip\" contendo recursivamente a pasta \"projects\".",
    "hint": "Execute zip -r proj.zip projects",
    "answer": "zip -r proj.zip projects",
    "answerSteps": [
      "zip -r proj.zip projects"
    ],
    "relatedCommands": [
      "zip",
      "unzip"
    ]
  },
  {
    "id": "lpic-unzip-extract",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Extrair pacote .zip para outra pasta",
    "description": "Descompacte o arquivo \"proj.zip\" extraindo seu conteúdo dentro da pasta \"downloads\".",
    "hint": "Use -d para escolher o diretório de destino: unzip proj.zip -d downloads",
    "answer": "unzip proj.zip -d downloads",
    "answerSteps": [
      "unzip proj.zip -d downloads"
    ],
    "relatedCommands": [
      "unzip",
      "zip"
    ]
  },
  {
    "id": "text-file-type",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.3",
    "title": "Identificar o formato real de um arquivo",
    "description": "Descubra qual é o tipo e formato real de dados de 'documents/readme.txt', independentemente da sua extensão.",
    "hint": "Execute file documents/readme.txt",
    "answer": "file documents/readme.txt",
    "answerSteps": [
      "file documents/readme.txt"
    ],
    "relatedCommands": [
      "file",
      "stat",
      "ls"
    ]
  },
  {
    "id": "text-tac-reverse",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.2",
    "title": "Exibir arquivo com ordem de linhas invertida",
    "description": "Exiba o conteúdo de 'documents/readme.txt' de baixo para cima, começando pela última linha e terminando na primeira.",
    "hint": "Execute tac documents/readme.txt",
    "answer": "tac documents/readme.txt",
    "answerSteps": [
      "tac documents/readme.txt"
    ],
    "relatedCommands": [
      "tac",
      "cat",
      "rev",
      "tail"
    ]
  },
  {
    "id": "text-rev-chars",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.2",
    "title": "Inverter os caracteres de cada linha",
    "description": "Imprima cada linha de 'documents/readme.txt' com seus caracteres espelhados (da direita para a esquerda).",
    "hint": "Execute rev documents/readme.txt",
    "answer": "rev documents/readme.txt",
    "answerSteps": [
      "rev documents/readme.txt"
    ],
    "relatedCommands": [
      "rev",
      "tac",
      "tr"
    ]
  },
  {
    "id": "text-nl-lines",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.2",
    "title": "Numerar todas as linhas de um arquivo",
    "description": "Exiba o conteúdo de 'documents/readme.txt' acompanhado do respectivo número de cada linha.",
    "hint": "Execute nl documents/readme.txt",
    "answer": "nl documents/readme.txt",
    "answerSteps": [
      "nl documents/readme.txt"
    ],
    "relatedCommands": [
      "nl",
      "cat -n",
      "wc -l"
    ]
  },
  {
    "id": "text-base64-encode",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.2",
    "title": "Codificar texto no padrão Base64",
    "description": "Converta a cadeia de texto \"Linux\" para sua representação codificada em Base64.",
    "hint": "Execute echo \"Linux\" | base64",
    "answer": "echo \"Linux\" | base64",
    "answerSteps": [
      "echo \"Linux\" | base64"
    ],
    "relatedCommands": [
      "base64",
      "base64 -d"
    ]
  },
  {
    "id": "text-base64-decode",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Iniciante",
    "lpicObjective": "103.2",
    "title": "Decodificar sequência Base64",
    "description": "Decodifique a sequência \"TGludXgK\" de volta para o texto original legível.",
    "hint": "Execute echo \"TGludXgK\" | base64 -d",
    "answer": "echo \"TGludXgK\" | base64 -d",
    "answerSteps": [
      "echo \"TGludXgK\" | base64 -d"
    ],
    "relatedCommands": [
      "base64 -d",
      "base64"
    ]
  },
  {
    "id": "lpic-ln-symbolic",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.6",
    "title": "Criar um link simbólico",
    "description": "Crie um link simbólico \"readme-link\" que aponte para documents/readme.txt.",
    "hint": "Use o comando ln -s (exemplo: ln -s documents/readme.txt readme-link)",
    "answer": "ln -s documents/readme.txt readme-link",
    "answerSteps": [
      "ln -s documents/readme.txt readme-link"
    ],
    "relatedCommands": [
      "ln",
      "ls",
      "cat"
    ]
  },
  {
    "id": "lpic-readlink",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.6",
    "title": "Descobrir o destino real de um link simbólico",
    "description": "Verifique para qual arquivo original o link simbólico \"readme-link\" está apontando.",
    "hint": "Execute readlink readme-link",
    "answer": "readlink readme-link",
    "answerSteps": [
      "readlink readme-link"
    ],
    "relatedCommands": [
      "readlink",
      "ln"
    ]
  },
  {
    "id": "lpic-ln-hardlink",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.6",
    "title": "Criar um link físico",
    "description": "Crie um link físico \"notes-hard.txt\" de documents/notes.txt.",
    "hint": "Use o comando ln sem -s (exemplo: ln documents/notes.txt notes-hard.txt)",
    "answer": "ln documents/notes.txt notes-hard.txt",
    "answerSteps": [
      "ln documents/notes.txt notes-hard.txt"
    ],
    "relatedCommands": [
      "ln",
      "ls",
      "cat"
    ]
  },
  {
    "id": "lpic-tar-create",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Criar um arquivo empacotado (.tar)",
    "description": "Empacote o diretório documents em um único arquivo chamado \"docs.tar\" (sem compressão).",
    "hint": "Use o comando tar -cf (exemplo: tar -cf docs.tar documents)",
    "answer": "tar -cf docs.tar documents",
    "answerSteps": [
      "tar -cf docs.tar documents"
    ],
    "relatedCommands": [
      "tar",
      "ls"
    ]
  },
  {
    "id": "lpic-tar-extract",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Empacotar e extrair um arquivo .tar",
    "description": "Empacote o diretório projects em um arquivo chamado \"proj.tar\" e, em seguida, extraia seu conteúdo com tar -xf.",
    "hint": "Execute tar -cf proj.tar projects && tar -xf proj.tar",
    "answer": "tar -cf proj.tar projects && tar -xf proj.tar",
    "answerSteps": [
      "tar -cf proj.tar projects && tar -xf proj.tar"
    ],
    "relatedCommands": [
      "tar",
      "ls",
      "cat"
    ]
  },
  {
    "id": "lpic-tar-gzip-create",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Criar arquivo .tar.gz comprimido com gzip",
    "description": "Empacote e comprima a pasta documents em um único arquivo \"docs.tar.gz\" usando tar com a opção -z.",
    "hint": "Execute tar -czf docs.tar.gz documents",
    "answer": "tar -czf docs.tar.gz documents",
    "answerSteps": [
      "tar -czf docs.tar.gz documents"
    ],
    "relatedCommands": [
      "tar",
      "gzip"
    ]
  },
  {
    "id": "lpic-tar-extract-dir",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Extrair pacote .tar.gz em diretório específico",
    "description": "Extraia o arquivo empacotado e comprimido 'archive.tar.gz' diretamente dentro da pasta downloads.",
    "hint": "Use a opção -C para definir o destino: tar -xzf archive.tar.gz -C downloads",
    "answer": "tar -xzf archive.tar.gz -C downloads",
    "answerSteps": [
      "tar -xzf archive.tar.gz -C downloads"
    ],
    "relatedCommands": [
      "tar"
    ]
  },
  {
    "id": "lpic-zcat-log",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Ler log compactado (.gz) sem descompactar no disco",
    "description": "Visualize o conteúdo do log rotacionado \"/var/log/nginx/access.log.1.gz\" diretamente no terminal sem alterá-lo.",
    "hint": "Execute zcat /var/log/nginx/access.log.1.gz",
    "answer": "zcat /var/log/nginx/access.log.1.gz",
    "answerSteps": [
      "zcat /var/log/nginx/access.log.1.gz"
    ],
    "relatedCommands": [
      "zcat",
      "gzip"
    ]
  },
  {
    "id": "lpic-umask",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.5",
    "title": "Definir máscara padrão de permissões (umask)",
    "description": "Configure a máscara padrão de criação de arquivos da sessão para 0027 usando umask, restringindo leitura de outros usuários em novos arquivos.",
    "hint": "Execute umask 0027",
    "answer": "umask 0027",
    "answerSteps": [
      "umask 0027"
    ],
    "relatedCommands": [
      "umask",
      "chmod",
      "ls -l"
    ]
  },
  {
    "id": "text-stat-info",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.5",
    "title": "Inspecionar metadados avançados e Inode",
    "description": "Exiba todas as informações de baixo nível de 'documents/readme.txt', como número de Inode, blocos de disco alocados e carimbos de acesso.",
    "hint": "Execute stat documents/readme.txt",
    "answer": "stat documents/readme.txt",
    "answerSteps": [
      "stat documents/readme.txt"
    ],
    "relatedCommands": [
      "stat",
      "ls -l",
      "ls -i",
      "file"
    ]
  },
  {
    "id": "text-sha256sum",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "110.1",
    "title": "Calcular hash de integridade SHA-256",
    "description": "Gere o código hash criptográfico de integridade de 256 bits para o arquivo 'documents/readme.txt'.",
    "hint": "Execute sha256sum documents/readme.txt",
    "answer": "sha256sum documents/readme.txt",
    "answerSteps": [
      "sha256sum documents/readme.txt"
    ],
    "relatedCommands": [
      "sha256sum",
      "md5sum",
      "cksum"
    ]
  },
  {
    "id": "lpic-md5sum",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "110.1",
    "title": "Calcular hash de verificação MD5",
    "description": "Calcule a soma de verificação MD5 do arquivo documents/readme.txt.",
    "hint": "Execute md5sum documents/readme.txt",
    "answer": "md5sum documents/readme.txt",
    "answerSteps": [
      "md5sum documents/readme.txt"
    ],
    "relatedCommands": [
      "md5sum",
      "sha256sum"
    ]
  },
  {
    "id": "lpic-grep-recursive",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.7",
    "title": "Buscar recursivamente em diretórios",
    "description": "Busque recursivamente no diretório documents e exiba as linhas que contêm \"Linux\".",
    "hint": "Use o comando grep -r (exemplo: grep -r Linux documents)",
    "answer": "grep -r Linux documents",
    "answerSteps": [
      "grep -r Linux documents"
    ],
    "relatedCommands": [
      "grep"
    ]
  },
  {
    "id": "lpic-find-type-depth",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "104.7",
    "title": "Limitar profundidade e filtrar apenas arquivos com find",
    "description": "Busque apenas arquivos comuns (-type f) a partir do diretório atual descendo no máximo 2 níveis (-maxdepth 2).",
    "hint": "Execute find . -maxdepth 2 -type f",
    "answer": "find . -maxdepth 2 -type f",
    "answerSteps": [
      "find . -maxdepth 2 -type f"
    ],
    "relatedCommands": [
      "find"
    ]
  },
  {
    "id": "lpic-find-exec-cat",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Intermediário",
    "lpicObjective": "103.3",
    "title": "Exibir o conteúdo de arquivos com find e -exec",
    "description": "Busque os arquivos \".txt\" em documents e exiba o conteúdo de cada arquivo encontrado com cat.",
    "hint": "Use find documents -name \"*.txt\" -exec cat {} \\;",
    "answer": "find documents -name \"*.txt\" -exec cat {} \\;",
    "answerSteps": [
      "find documents -name \"*.txt\" -exec cat {} \\;"
    ],
    "relatedCommands": [
      "find",
      "cat"
    ]
  },
  {
    "id": "lpic-find-exec-grep",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Avançado",
    "lpicObjective": "103.3",
    "title": "Localizar arquivos e buscar termo internamente",
    "description": "Encontre todos os arquivos \".txt\" na pasta documents e filtre apenas as linhas que contenham o termo \"ls\".",
    "hint": "Use find documents -name \"*.txt\" -exec grep ls {} \\;",
    "answer": "find documents -name \"*.txt\" -exec grep ls {} \\;",
    "answerSteps": [
      "find documents -name \"*.txt\" -exec grep ls {} \\;"
    ],
    "relatedCommands": [
      "find",
      "grep"
    ]
  },
  {
    "id": "lpic-find-tar-combo",
    "category": "lpic",
    "categoryLabel": "LPIC-1",
    "difficulty": "Avançado",
    "lpicObjective": "103.3",
    "title": "Localizar diretório e criar pacote de backup",
    "description": "Localize a pasta projects com ferramenta de busca e arquive seu conteúdo em um pacote chamado \"proj-backup.tar\".",
    "hint": "Após verificar com find . -type d -name projects, execute tar -cf proj-backup.tar projects",
    "answer": "find . -type d -name projects && tar -cf proj-backup.tar projects",
    "answerSteps": [
      "find . -type d -name projects",
      "tar -cf proj-backup.tar projects"
    ],
    "relatedCommands": [
      "find",
      "tar"
    ]
  },
  {
    "id": "git-init",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar um repositório",
    "description": "Transforme o diretório atual em um repositório Git.\nCom um repositório, você passa a registrar o histórico de alterações dos arquivos.",
    "hint": "Use o comando git init",
    "answer": "git init",
    "answerSteps": [
      "git init"
    ],
    "relatedCommands": [
      "git init",
      "ls"
    ]
  },
  {
    "id": "git-status-untracked",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Verificar arquivos não rastreados",
    "description": "Exiba o estado do repositório e veja quais arquivos ainda não são gerenciados pelo Git (arquivos não rastreados).",
    "hint": "Use o comando git status",
    "answer": "git status",
    "answerSteps": [
      "git status"
    ],
    "relatedCommands": [
      "git status",
      "ls"
    ]
  },
  {
    "id": "git-add",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Preparar um arquivo",
    "description": "Coloque o README.md na área de preparação para que ele entre no próximo commit.\nA preparação é onde você separa as alterações que deseja registrar.",
    "hint": "Informe o nome do arquivo, por exemplo git add README.md",
    "answer": "git add README.md",
    "answerSteps": [
      "git add README.md"
    ],
    "relatedCommands": [
      "git add",
      "git status"
    ]
  },
  {
    "id": "git-commit",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Registrar as alterações",
    "description": "Faça o commit do README.md preparado, com uma mensagem.\nA mensagem é a pista para reler o histórico depois.",
    "hint": "Use -m para informar a mensagem, por exemplo git commit -m \"first commit\"",
    "answer": "git commit -m \"first commit\"",
    "answerSteps": [
      "git commit -m \"first commit\""
    ],
    "relatedCommands": [
      "git commit",
      "git status"
    ]
  },
  {
    "id": "git-log",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Verificar o histórico",
    "description": "Exiba o histórico de commits feitos até aqui.",
    "hint": "Use o comando git log",
    "answer": "git log",
    "answerSteps": [
      "git log"
    ],
    "relatedCommands": [
      "git log",
      "git commit"
    ]
  },
  {
    "id": "git-add-all",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Preparar vários arquivos de uma vez",
    "description": "Prepare os arquivos restantes index.html e style.css em uma única operação.",
    "hint": "git add . prepara tudo que está abaixo do diretório atual",
    "answer": "git add .",
    "answerSteps": [
      "git add ."
    ],
    "relatedCommands": [
      "git add",
      "git status"
    ]
  },
  {
    "id": "git-commit-second",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Segundo commit",
    "description": "Prepare index.html e style.css e crie o segundo commit.\nConfirme que o histórico passa a ter dois registros.",
    "hint": "Execute git add . e depois git commit -m \"add pages\"",
    "answer": "git add . && git commit -m \"add pages\"",
    "answerSteps": [
      "git add .",
      "git commit -m \"add pages\""
    ],
    "relatedCommands": [
      "git add",
      "git commit",
      "git log"
    ]
  },
  {
    "id": "git-branch-create",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Criar uma ramificação",
    "description": "Crie uma ramificação chamada \"feature\".\nA ramificação permite trabalhar em paralelo mantendo o histórico atual.",
    "hint": "Informe o nome da ramificação, por exemplo git branch feature",
    "answer": "git branch feature",
    "answerSteps": [
      "git branch feature"
    ],
    "relatedCommands": [
      "git branch",
      "git switch"
    ]
  },
  {
    "id": "git-branch-list",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Listar as ramificações",
    "description": "Liste as ramificações e verifique em qual delas você está.\nA ramificação atual recebe um *.",
    "hint": "Execute git branch sem argumentos",
    "answer": "git branch",
    "answerSteps": [
      "git branch"
    ],
    "relatedCommands": [
      "git branch",
      "git status"
    ]
  },
  {
    "id": "git-switch",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Trocar de ramificação",
    "description": "Troque para a ramificação feature que você criou.",
    "hint": "Execute git switch feature (git checkout feature faz o mesmo)",
    "answer": "git switch feature",
    "answerSteps": [
      "git switch feature"
    ],
    "relatedCommands": [
      "git switch",
      "git checkout",
      "git branch"
    ]
  },
  {
    "id": "git-switch-create",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Criar e trocar para uma nova ramificação (branch)",
    "description": "Crie uma nova ramificação (branch) chamada \"hotfix\" e já mude para ela em uma única operação.",
    "hint": "Use git switch -c hotfix (ou git checkout -b hotfix)",
    "answer": "git switch -c hotfix",
    "answerSteps": [
      "git switch -c hotfix"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "git-diff-staged",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Revisar alterações já adicionadas ao stage",
    "description": "Antes de confirmar o commit, inspecione exatamente quais linhas estão preparadas na área de stage (README.md).",
    "hint": "Execute git diff --staged",
    "answer": "git diff --staged",
    "answerSteps": [
      "git diff --staged"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "git-restore-staged",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover arquivo sensível da área de stage",
    "description": "Alguém executou git add e incluiu o arquivo secreto \".env\" no stage por engano! Remova apenas \".env\" da área de stage sem apagar o arquivo.",
    "hint": "Execute git restore --staged .env (ou git reset HEAD .env)",
    "answer": "git restore --staged .env",
    "answerSteps": [
      "git restore --staged .env"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "git-gitignore",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ignorar arquivos sensíveis com .gitignore",
    "description": "Adicione \".env\" ao arquivo .gitignore para impedir que segredos apareçam como não rastreados e confirme o resultado com git status.",
    "hint": "Execute echo \".env\" > .gitignore && git status",
    "answer": "echo \".env\" > .gitignore && git status",
    "answerSteps": [
      "echo \".env\" > .gitignore",
      "git status"
    ],
    "relatedCommands": [
      "git",
      "git status"
    ]
  },
  {
    "id": "git-merge",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Mesclar alterações de outra ramificação",
    "description": "Você está na ramificação (branch) \"main\". Traga os commits da ramificação \"feature\" para a atual usando merge.",
    "hint": "Execute git merge feature",
    "answer": "git merge feature",
    "answerSteps": [
      "git merge feature"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "git-branch-delete",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Excluir uma ramificação após finalizar o trabalho",
    "description": "Exclua a ramificação \"feature\" que não é mais necessária.",
    "hint": "Execute git branch -d feature",
    "answer": "git branch -d feature",
    "answerSteps": [
      "git branch -d feature"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "git-stash",
    "category": "git",
    "categoryLabel": "Git",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Guardar e restaurar alterações temporárias com stash",
    "description": "Salve suas alterações pendentes na pilha temporária do Git (stash) e em seguida recupere-as de volta com stash pop.",
    "hint": "Execute git stash e depois git stash pop",
    "answer": "git stash && git stash pop",
    "answerSteps": [
      "git stash",
      "git stash pop"
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "docker-pull",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Baixar uma imagem",
    "description": "Baixe a imagem hello-world.\nA imagem é a \"planta\" do contêiner, então tudo começa trazendo uma para a sua máquina.",
    "hint": "Execute docker pull hello-world",
    "answer": "docker pull hello-world",
    "answerSteps": [
      "docker pull hello-world"
    ],
    "relatedCommands": [
      "docker pull",
      "docker images"
    ]
  },
  {
    "id": "docker-images",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Listar as imagens",
    "description": "Liste as imagens que você tem localmente e confirme que a hello-world está lá.",
    "hint": "Execute docker images",
    "answer": "docker images",
    "answerSteps": [
      "docker images"
    ],
    "relatedCommands": [
      "docker images",
      "docker pull"
    ]
  },
  {
    "id": "docker-run-hello",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Executar primeiro contêiner de teste",
    "description": "Crie e execute uma instância a partir da imagem hello-world para validar o ambiente de contêineres.",
    "hint": "Execute docker run hello-world",
    "answer": "docker run hello-world",
    "answerSteps": [
      "docker run hello-world"
    ],
    "relatedCommands": [
      "docker run",
      "docker ps"
    ]
  },
  {
    "id": "docker-ps-a",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Inspecionar contêineres inativos e encerrados",
    "description": "Exiba a listagem completa de contêineres do sistema, incluindo aqueles que já finalizaram sua execução.",
    "hint": "Execute docker ps -a",
    "answer": "docker ps -a",
    "answerSteps": [
      "docker ps -a"
    ],
    "relatedCommands": [
      "docker ps",
      "docker run"
    ]
  },
  {
    "id": "docker-run-detached",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Executar contêiner em segundo plano",
    "description": "Inicie um contêiner em modo desacoplado (background) chamado \"web\" utilizando a imagem nginx.",
    "hint": "Execute docker run -d --name web nginx",
    "answer": "docker run -d --name web nginx",
    "answerSteps": [
      "docker run -d --name web nginx"
    ],
    "relatedCommands": [
      "docker run",
      "docker ps"
    ]
  },
  {
    "id": "docker-ps",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Verificar contêineres em execução",
    "description": "Liste os contêineres que estão em execução agora e confirme que o web está ativo.",
    "hint": "Execute docker ps sem argumentos",
    "answer": "docker ps",
    "answerSteps": [
      "docker ps"
    ],
    "relatedCommands": [
      "docker ps",
      "docker run"
    ]
  },
  {
    "id": "docker-stop",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Interromper contêiner em execução",
    "description": "Finalize a execução do contêiner em funcionamento chamado \"web\".",
    "hint": "Execute docker stop web",
    "answer": "docker stop web",
    "answerSteps": [
      "docker stop web"
    ],
    "relatedCommands": [
      "docker stop",
      "docker ps"
    ]
  },
  {
    "id": "docker-start",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Reiniciar um contêiner que estava parado",
    "description": "O contêiner \"web\" foi interrompido anteriormente (Exited). Inicie-o novamente sem criar um novo contêiner.",
    "hint": "Execute docker start web",
    "answer": "docker start web",
    "answerSteps": [
      "docker start web"
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "docker-rm",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Excluir contêiner inativo",
    "description": "Remova do sistema o contêiner \"web\" que já se encontra parado.",
    "hint": "Execute docker rm web",
    "answer": "docker rm web",
    "answerSteps": [
      "docker rm web"
    ],
    "relatedCommands": [
      "docker rm",
      "docker stop",
      "docker ps"
    ]
  },
  {
    "id": "docker-rmi",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover uma imagem",
    "description": "Remova a imagem hello-world.\nUma imagem não pode ser removida enquanto um contêiner ainda a usa, então remova o contêiner antes.",
    "hint": "Execute docker rmi hello-world",
    "answer": "docker rmi hello-world",
    "answerSteps": [
      "docker rmi hello-world"
    ],
    "relatedCommands": [
      "docker rmi",
      "docker rm",
      "docker images"
    ]
  },
  {
    "id": "docker-run-port",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Publicar serviço com mapeamento de porta",
    "description": "Inicie em background um contêiner chamado \"web2\" a partir do nginx, mapeando a porta 8080 do host para a porta 80 do contêiner.",
    "hint": "Execute docker run -d -p 8080:80 --name web2 nginx",
    "answer": "docker run -d -p 8080:80 --name web2 nginx",
    "answerSteps": [
      "docker run -d -p 8080:80 --name web2 nginx"
    ],
    "relatedCommands": [
      "docker run",
      "docker ps"
    ]
  },
  {
    "id": "docker-logs",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Inspecionar logs de um contêiner em execução",
    "description": "O contêiner \"web2\" está rodando em background. Consulte suas mensagens de log para verificar a inicialização do nginx.",
    "hint": "Execute docker logs web2",
    "answer": "docker logs web2",
    "answerSteps": [
      "docker logs web2"
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "docker-exec",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Executar comando dentro de um contêiner ativo",
    "description": "Acesse o contêiner \"web2\" em execução e rode o comando \"uname -a\" dentro dele.",
    "hint": "Execute docker exec -it web2 uname -a",
    "answer": "docker exec -it web2 uname -a",
    "answerSteps": [
      "docker exec -it web2 uname -a"
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "docker-inspect",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Inspecionar metadados completos de um contêiner",
    "description": "Exiba os detalhes técnicos em formato JSON (estado, imagem, portas) do contêiner \"web2\".",
    "hint": "Execute docker inspect web2",
    "answer": "docker inspect web2",
    "answerSteps": [
      "docker inspect web2"
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "docker-build",
    "category": "docker",
    "categoryLabel": "Docker",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Construir uma imagem própria via Dockerfile",
    "description": "Há um arquivo \"Dockerfile\" no diretório atual. Construa uma imagem chamada \"penguin-api:1.0\" a partir dele.",
    "hint": "Execute docker build -t penguin-api:1.0 .",
    "answer": "docker build -t penguin-api:1.0 .",
    "answerSteps": [
      "docker build -t penguin-api:1.0 ."
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "bash-arithmetic",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Calcular expressões matemáticas no terminal",
    "description": "Calcule o resultado da operação (15 + 5) * 2 diretamente através dos recursos de cálculo interno do shell.",
    "hint": "Execute echo $(( (15 + 5) * 2 ))",
    "answer": "echo $(( (15 + 5) * 2 ))",
    "answerSteps": [
      "echo $(( (15 + 5) * 2 ))"
    ],
    "relatedCommands": [
      "$(( ... ))",
      "expr",
      "bc",
      "let"
    ]
  },
  {
    "id": "bash-exit-code",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "105.1",
    "title": "Consultar código de status do comando anterior",
    "description": "Exiba o valor retornado pelo último comando executado para saber se ele foi concluído com sucesso (0) ou erro.",
    "hint": "Execute echo $?",
    "answer": "echo $?",
    "answerSteps": [
      "echo $?"
    ],
    "relatedCommands": [
      "$?",
      "$$",
      "$USER",
      "$PWD"
    ]
  },
  {
    "id": "bash-alias-create",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Criar atalho de comando personalizado",
    "description": "Crie um atalho rápido chamado 'c' que limpe a tela do terminal quando digitado.",
    "hint": "Execute alias c='clear'",
    "answer": "alias c='clear'",
    "answerSteps": [
      "alias c='clear'"
    ],
    "relatedCommands": [
      "alias",
      "unalias",
      "type"
    ]
  },
  {
    "id": "bash-alias-list",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Listar atalhos definidos no ambiente",
    "description": "Exiba no terminal todos os aliases (atalhos) configurados na sessão atual.",
    "hint": "Execute o comando alias",
    "answer": "alias",
    "answerSteps": [
      "alias"
    ],
    "relatedCommands": [
      "alias",
      "unalias",
      "type ll"
    ]
  },
  {
    "id": "bash-alias-remove",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Remover atalho de comando existente",
    "description": "Desative e exclua a definição do atalho de comando 'c' que havia sido criado no shell.",
    "hint": "Execute unalias c",
    "answer": "unalias c",
    "answerSteps": [
      "unalias c"
    ],
    "relatedCommands": [
      "unalias",
      "unalias -a",
      "alias"
    ]
  },
  {
    "id": "bash-history-list",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Listar histórico numerado de comandos",
    "description": "Exiba a lista de comandos digitados recentemente nesta sessão do shell.",
    "hint": "Execute history",
    "answer": "history",
    "answerSteps": [
      "history"
    ],
    "relatedCommands": [
      "history",
      "!!"
    ]
  },
  {
    "id": "bash-history-exec",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": "103.1",
    "title": "Reexecutar o último comando do histórico",
    "description": "Execute instantaneamente o comando mais recente do histórico utilizando o operador rápido de repetição do shell.",
    "hint": "Digite !! e pressione Enter",
    "answer": "!!",
    "answerSteps": [
      "!!"
    ],
    "relatedCommands": [
      "!!",
      "!n",
      "history",
      "Ctrl+R"
    ]
  },
  {
    "id": "bash-export-env",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Exportar uma variável de ambiente",
    "description": "Crie e exporte a variável de ambiente GYM_ENV com o valor \"production\" para que processos filhos a enxerguem.",
    "hint": "Execute export GYM_ENV=production",
    "answer": "export GYM_ENV=production",
    "answerSteps": [
      "export GYM_ENV=production"
    ],
    "relatedCommands": [
      "export",
      "env"
    ]
  },
  {
    "id": "bash-redirect-stderr",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.4",
    "title": "Redirecionar mensagens de erro para arquivo",
    "description": "Tente listar o diretório protegido '/root' e grave exclusivamente as mensagens de erro geradas no arquivo 'erros.txt'.",
    "hint": "Execute ls /root 2> erros.txt",
    "answer": "ls /root 2> erros.txt",
    "answerSteps": [
      "ls /root 2> erros.txt"
    ],
    "relatedCommands": [
      "2>",
      "2>>",
      "&>",
      "1>",
      ">"
    ]
  },
  {
    "id": "bash-redirect-all",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.4",
    "title": "Redirecionar tanto saídas quanto erros",
    "description": "Liste os diretórios '/tmp' (válido) e '/root' (sem permissão) ao mesmo tempo, direcionando tanto a saída padrão quanto os erros para 'tudo.log'.",
    "hint": "Execute ls /tmp /root &> tudo.log",
    "answer": "ls /tmp /root &> tudo.log",
    "answerSteps": [
      "ls /tmp /root &> tudo.log"
    ],
    "relatedCommands": [
      "&>",
      "&>>",
      "2>&1",
      ">"
    ]
  },
  {
    "id": "bash-redirect-devnull",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.4",
    "title": "Descartar e silenciar mensagens de erro",
    "description": "Tente listar o diretório restrito '/root' e descarte completamente quaisquer mensagens de erro sem exibir nada na tela.",
    "hint": "Execute ls /root 2> /dev/null",
    "answer": "ls /root 2> /dev/null",
    "answerSteps": [
      "ls /root 2> /dev/null"
    ],
    "relatedCommands": [
      "2> /dev/null",
      "&> /dev/null",
      "/dev/null"
    ]
  },
  {
    "id": "bash-here-string",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.4",
    "title": "Passar texto direto como entrada padrão",
    "description": "Utilize o operador de Here-String (<<<) do Bash para alimentar a entrada padrão do comando cat diretamente com a string 'Penguin Gym'.",
    "hint": "Execute cat <<< \"Penguin Gym\"",
    "answer": "cat <<< \"Penguin Gym\"",
    "answerSteps": [
      "cat <<< \"Penguin Gym\""
    ],
    "relatedCommands": [
      "<<<",
      "<<",
      "<",
      "echo |"
    ]
  },
  {
    "id": "bash-subshell",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.1",
    "title": "Executar comando em ambiente de subshell isolado",
    "description": "Entre no diretório '/tmp' e mostre o caminho atual dentro de um ambiente isolado (subshell), sem alterar o diretório da sua sessão principal.",
    "hint": "Execute (cd /tmp && pwd)",
    "answer": "(cd /tmp && pwd)",
    "answerSteps": [
      "(cd /tmp && pwd)"
    ],
    "relatedCommands": [
      "( ... )",
      "cd",
      "pwd",
      "$$"
    ]
  },
  {
    "id": "bash-dir-stack",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "103.1",
    "title": "Navegar empilhando o diretório de origem",
    "description": "Mude para o diretório '/etc' salvando a pasta atual na pilha interna de navegação de diretórios.",
    "hint": "Execute pushd /etc",
    "answer": "pushd /etc",
    "answerSteps": [
      "pushd /etc"
    ],
    "relatedCommands": [
      "pushd",
      "popd",
      "dirs",
      "cd -"
    ]
  },
  {
    "id": "bash-popd",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Voltar ao diretório empilhado com popd",
    "description": "Empilhe a pasta atual indo para /etc com pushd e depois retorne exatamente de onde veio usando popd.",
    "hint": "Execute pushd /etc && popd",
    "answer": "pushd /etc && popd",
    "answerSteps": [
      "pushd /etc && popd"
    ],
    "relatedCommands": [
      "pushd",
      "popd",
      "dirs"
    ]
  },
  {
    "id": "bash-source-bashrc",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Recarregar configurações do .bashrc na sessão atual",
    "description": "Aplique imediatamente as definições e aliases do arquivo \"~/.bashrc\" no shell atual sem abrir outro terminal.",
    "hint": "Execute source ~/.bashrc (ou . ~/.bashrc)",
    "answer": "source ~/.bashrc",
    "answerSteps": [
      "source ~/.bashrc"
    ],
    "relatedCommands": [
      "source"
    ]
  },
  {
    "id": "bash-run-script",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": "105.1",
    "title": "Executar arquivo de script de comandos",
    "description": "Execute todas as instruções contidas no arquivo 'script.sh' através do interpretador shell.",
    "hint": "Execute bash script.sh ou ./script.sh",
    "answer": "bash script.sh",
    "answerSteps": [
      "bash script.sh"
    ],
    "relatedCommands": [
      "bash",
      "sh",
      "source",
      "./script.sh"
    ]
  },
  {
    "id": "bash-exec-chmod",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Tornar script executável e rodá-lo com ./",
    "description": "O arquivo \"script.sh\" não tem permissão de execução. Adicione +x e execute-o diretamente usando ./script.sh.",
    "hint": "Execute chmod +x script.sh && ./script.sh",
    "answer": "chmod +x script.sh && ./script.sh",
    "answerSteps": [
      "chmod +x script.sh && ./script.sh"
    ],
    "relatedCommands": [
      "chmod",
      "./script.sh"
    ]
  },
  {
    "id": "bash-script-args",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Passar argumento posicional ($1) para um script",
    "description": "O script \"saudacao.sh\" usa $1 para cumprimentar alguém. Execute-o passando \"Penguin\" como primeiro argumento.",
    "hint": "Execute bash saudacao.sh Penguin",
    "answer": "bash saudacao.sh Penguin",
    "answerSteps": [
      "bash saudacao.sh Penguin"
    ],
    "relatedCommands": [
      "bash"
    ]
  },
  {
    "id": "bash-cmd-subst",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Capturar saída de comando com $(...)",
    "description": "Use substituição de comando $(...) dentro de echo para imprimir \"Kernel: Linux\" dinamicamente a partir do comando uname.",
    "hint": "Execute echo \"Kernel: $(uname)\"",
    "answer": "echo \"Kernel: $(uname)\"",
    "answerSteps": [
      "echo \"Kernel: $(uname)\""
    ],
    "relatedCommands": [
      "echo",
      "uname"
    ]
  },
  {
    "id": "bash-or-fallback",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Executar fallback em caso de falha (||)",
    "description": "Tente ler \"inexistente.txt\" com cat e, caso falhe, exiba \"Arquivo ausente\" usando o operador ||.",
    "hint": "Execute cat inexistente.txt || echo \"Arquivo ausente\"",
    "answer": "cat inexistente.txt || echo \"Arquivo ausente\"",
    "answerSteps": [
      "cat inexistente.txt || echo \"Arquivo ausente\""
    ],
    "relatedCommands": [
      "cat",
      "echo"
    ]
  },
  {
    "id": "bash-loop-for",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Avançado",
    "lpicObjective": "105.2",
    "title": "Criar múltiplos arquivos com laço de repetição",
    "description": "Crie em um único comando os arquivos 'log_1.txt', 'log_2.txt' e 'log_3.txt' utilizando um laço for no terminal.",
    "hint": "Execute for i in 1 2 3; do touch \"log_$i.txt\"; done",
    "answer": "for i in 1 2 3; do touch \"log_$i.txt\"; done",
    "answerSteps": [
      "for i in 1 2 3; do touch \"log_$i.txt\"; done"
    ],
    "relatedCommands": [
      "for",
      "while",
      "until",
      "seq"
    ]
  },
  {
    "id": "bash-test-condition",
    "category": "scripting",
    "categoryLabel": "Scripts",
    "difficulty": "Avançado",
    "lpicObjective": "105.2",
    "title": "Testar existência de arquivo com condicional",
    "description": "Escreva uma estrutura condicional no terminal que verifique se o arquivo 'documents/readme.txt' existe e imprima \"Existe\" em caso positivo.",
    "hint": "Execute if [ -f documents/readme.txt ]; then echo \"Existe\"; fi",
    "answer": "if [ -f documents/readme.txt ]; then echo \"Existe\"; fi",
    "answerSteps": [
      "if [ -f documents/readme.txt ]; then echo \"Existe\"; fi"
    ],
    "relatedCommands": [
      "if",
      "test",
      "[",
      "[["
    ]
  },
  {
    "id": "net-ip-addr",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.1",
    "title": "Inspecionar interfaces e endereços de rede",
    "description": "Exiba todas as placas de rede do sistema e seus respectivos endereços IPv4 e IPv6 configurados.",
    "hint": "Use o comando ip addr show ou a forma abreviada ip a",
    "answer": "ip addr show",
    "answerSteps": [
      "ip addr show"
    ],
    "relatedCommands": [
      "ip addr",
      "ip a",
      "ip link",
      "ifconfig"
    ]
  },
  {
    "id": "net-ping",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.3",
    "title": "Testar conectividade com limite de disparos",
    "description": "Verifique se o host \"localhost\" responde enviando exatamente 4 pacotes de teste antes de encerrar.",
    "hint": "Use a opção -c 4 com o comando ping",
    "answer": "ping -c 4 localhost",
    "answerSteps": [
      "ping -c 4 localhost"
    ],
    "relatedCommands": [
      "ping",
      "ping -c",
      "traceroute"
    ]
  },
  {
    "id": "net-etc-hosts",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Inspecionar resolução local de nomes (/etc/hosts)",
    "description": "Consulte o arquivo de mapeamento estático local de IPs e hostnames do sistema.",
    "hint": "Execute cat /etc/hosts",
    "answer": "cat /etc/hosts",
    "answerSteps": [
      "cat /etc/hosts"
    ],
    "relatedCommands": [
      "cat",
      "dig"
    ]
  },
  {
    "id": "net-curl-get",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.2",
    "title": "Efetuar requisição HTTP no terminal",
    "description": "Faça uma requisição web para a URL \"http://localhost\" e obtenha o conteúdo da página retornado pelo servidor.",
    "hint": "Execute curl http://localhost",
    "answer": "curl http://localhost",
    "answerSteps": [
      "curl http://localhost"
    ],
    "relatedCommands": [
      "curl",
      "wget",
      "curl -I",
      "curl -o"
    ]
  },
  {
    "id": "net-wget",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.2",
    "title": "Download direto de arquivo via rede",
    "description": "Faça o download do arquivo de dados localizado em \"http://localhost/dados.txt\" para o diretório atual.",
    "hint": "Execute wget http://localhost/dados.txt",
    "answer": "wget http://localhost/dados.txt",
    "answerSteps": [
      "wget http://localhost/dados.txt"
    ],
    "relatedCommands": [
      "wget",
      "wget -O",
      "wget -q",
      "curl"
    ]
  },
  {
    "id": "net-dig",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.4",
    "title": "Consultar informações de zona DNS",
    "description": "Obtenha os registros detalhados de resolução de nomes para o domínio \"penguin-gym.com\".",
    "hint": "Execute dig penguin-gym.com",
    "answer": "dig penguin-gym.com",
    "answerSteps": [
      "dig penguin-gym.com"
    ],
    "relatedCommands": [
      "dig",
      "dig +short",
      "nslookup",
      "host"
    ]
  },
  {
    "id": "net-nslookup",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.4",
    "title": "Resolver nome de domínio via servidor DNS",
    "description": "Consulte a resolução de endereço do domínio \"penguin-gym.com\" no servidor DNS padrão.",
    "hint": "Execute nslookup penguin-gym.com",
    "answer": "nslookup penguin-gym.com",
    "answerSteps": [
      "nslookup penguin-gym.com"
    ],
    "relatedCommands": [
      "nslookup",
      "dig",
      "host"
    ]
  },
  {
    "id": "net-host",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Iniciante",
    "lpicObjective": "109.4",
    "title": "Consultar apontamentos e registros de e-mail",
    "description": "Verifique de forma rápida o endereço IP e os servidores de e-mail (MX) vinculados ao domínio \"penguin-gym.com\".",
    "hint": "Execute host penguin-gym.com",
    "answer": "host penguin-gym.com",
    "answerSteps": [
      "host penguin-gym.com"
    ],
    "relatedCommands": [
      "host",
      "dig",
      "nslookup"
    ]
  },
  {
    "id": "net-ip-route",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.1",
    "title": "Visualizar tabela de rotas de rede",
    "description": "Exiba a tabela de roteamento do kernel Linux e verifique qual é o gateway padrão (default via).",
    "hint": "Use o comando ip route",
    "answer": "ip route",
    "answerSteps": [
      "ip route"
    ],
    "relatedCommands": [
      "ip route",
      "ip r",
      "route",
      "netstat -r"
    ]
  },
  {
    "id": "net-traceroute",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.3",
    "title": "Rastrear rota de pacotes na rede",
    "description": "Utilize o traceroute para traçar a rota e inspecionar cada salto de roteador até o domínio 'penguin-gym.com'.",
    "hint": "Execute traceroute penguin-gym.com",
    "answer": "traceroute penguin-gym.com",
    "answerSteps": [
      "traceroute penguin-gym.com"
    ],
    "relatedCommands": [
      "traceroute",
      "ping",
      "ip route",
      "tracepath"
    ]
  },
  {
    "id": "net-curl-head",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.2",
    "title": "Inspecionar apenas cabeçalhos HTTP",
    "description": "Consulte \"http://localhost\" obtendo exclusivamente os cabeçalhos de resposta HTTP (como status 200, servidor e Content-Type).",
    "hint": "Use a opção -I ou --head com o comando curl",
    "answer": "curl -I http://localhost",
    "answerSteps": [
      "curl -I http://localhost"
    ],
    "relatedCommands": [
      "curl -I",
      "curl --head",
      "curl",
      "wget"
    ]
  },
  {
    "id": "net-curl-download",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.2",
    "title": "Transferir arquivo web para o disco",
    "description": "Baixe o conteúdo do endpoint \"http://localhost/api/data\" salvando o resultado diretamente no arquivo local \"saida.json\".",
    "hint": "Execute curl -o saida.json http://localhost/api/data",
    "answer": "curl -o saida.json http://localhost/api/data",
    "answerSteps": [
      "curl -o saida.json http://localhost/api/data"
    ],
    "relatedCommands": [
      "curl -o",
      "curl -O",
      "wget",
      "jq"
    ]
  },
  {
    "id": "net-ss-listen",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.1",
    "title": "Listar portas TCP em estado de escuta",
    "description": "Exiba todos os sockets e serviços que estão atualmente aguardando conexões (LISTEN) nas portas do sistema.",
    "hint": "Execute ss -tulpn ou ss -tl",
    "answer": "ss -tulpn",
    "answerSteps": [
      "ss -tulpn"
    ],
    "relatedCommands": [
      "ss",
      "ss -tl",
      "ss -tulpn",
      "netstat -tuln"
    ]
  },
  {
    "id": "net-netstat",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.1",
    "title": "Visualizar portas e conexões ativas",
    "description": "Exiba as portas de servidores em escuta no sistema de forma numérica sem conversão de nomes de serviço.",
    "hint": "Execute netstat -tuln",
    "answer": "netstat -tuln",
    "answerSteps": [
      "netstat -tuln"
    ],
    "relatedCommands": [
      "netstat",
      "netstat -tuln",
      "ss",
      "lsof"
    ]
  },
  {
    "id": "net-dig-short",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.4",
    "title": "Obter apenas o endereço IP via DNS",
    "description": "Consulte o domínio \"penguin-gym.com\" exibindo de forma limpa apenas o endereço IP correspondente, sem cabeçalhos.",
    "hint": "Execute dig +short penguin-gym.com",
    "answer": "dig +short penguin-gym.com",
    "answerSteps": [
      "dig +short penguin-gym.com"
    ],
    "relatedCommands": [
      "dig +short",
      "dig",
      "host",
      "nslookup"
    ]
  },
  {
    "id": "net-nc-port",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "109.3",
    "title": "Testar abertura de porta TCP remota",
    "description": "Teste se a porta de serviço 80 do servidor \"localhost\" está aberta e recebendo conexões, sem transferir dados.",
    "hint": "Execute nc localhost 80 ou nc -zv localhost 80",
    "answer": "nc localhost 80",
    "answerSteps": [
      "nc localhost 80"
    ],
    "relatedCommands": [
      "nc",
      "nc -zv",
      "telnet",
      "nmap"
    ]
  },
  {
    "id": "net-nmap-scan",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Escanear portas abertas com nmap",
    "description": "Faça uma varredura de portas TCP abertas no host \"localhost\" utilizando o nmap.",
    "hint": "Execute nmap localhost",
    "answer": "nmap localhost",
    "answerSteps": [
      "nmap localhost"
    ],
    "relatedCommands": [
      "nmap",
      "ss"
    ]
  },
  {
    "id": "net-scp-copy",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Copiar arquivo com segurança via SSH (scp)",
    "description": "Envie o arquivo local \"documents/readme.txt\" para \"/tmp/\" no servidor remoto user@192.168.1.50 usando scp.",
    "hint": "Execute scp documents/readme.txt user@192.168.1.50:/tmp/",
    "answer": "scp documents/readme.txt user@192.168.1.50:/tmp/",
    "answerSteps": [
      "scp documents/readme.txt user@192.168.1.50:/tmp/"
    ],
    "relatedCommands": [
      "scp",
      "rsync"
    ]
  },
  {
    "id": "net-rsync-sync",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Sincronizar diretório com rsync",
    "description": "Sincronize recursivamente a pasta \"projects/\" para \"user@192.168.1.50:/backup/\" preservando atributos (-av).",
    "hint": "Execute rsync -av projects/ user@192.168.1.50:/backup/",
    "answer": "rsync -av projects/ user@192.168.1.50:/backup/",
    "answerSteps": [
      "rsync -av projects/ user@192.168.1.50:/backup/"
    ],
    "relatedCommands": [
      "rsync",
      "scp"
    ]
  },
  {
    "id": "net-ufw-status",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "110.1",
    "title": "Verificar estado do firewall do sistema",
    "description": "Exiba as regras de segurança ativas e o status de proteção do firewall local.",
    "hint": "Execute sudo ufw status",
    "answer": "sudo ufw status",
    "answerSteps": [
      "sudo ufw status"
    ],
    "relatedCommands": [
      "sudo ufw status",
      "ufw status",
      "iptables",
      "nftables"
    ]
  },
  {
    "id": "net-ufw-enable",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "110.1",
    "title": "Ativar o firewall do sistema",
    "description": "Habilite o firewall para proteger o sistema e bloquear tráfego de entrada não autorizado.",
    "hint": "Execute sudo ufw enable",
    "answer": "sudo ufw enable",
    "answerSteps": [
      "sudo ufw enable"
    ],
    "relatedCommands": [
      "sudo ufw enable",
      "sudo ufw disable",
      "sudo ufw status"
    ]
  },
  {
    "id": "net-ufw-allow",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": "110.1",
    "title": "Liberar porta de tráfego web no firewall",
    "description": "Crie uma regra no firewall permitindo a entrada de conexões na porta 80 via protocolo TCP.",
    "hint": "Execute sudo ufw allow 80/tcp",
    "answer": "sudo ufw allow 80/tcp",
    "answerSteps": [
      "sudo ufw allow 80/tcp"
    ],
    "relatedCommands": [
      "sudo ufw allow",
      "sudo ufw allow 80/tcp",
      "sudo ufw delete allow"
    ]
  },
  {
    "id": "net-ufw-deny",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Bloquear porta insegura no firewall (ufw deny)",
    "description": "Bloqueie explicitamente o tráfego de entrada na porta 23/tcp (Telnet) no firewall UFW.",
    "hint": "Execute sudo ufw deny 23/tcp",
    "answer": "sudo ufw deny 23/tcp",
    "answerSteps": [
      "sudo ufw deny 23/tcp"
    ],
    "relatedCommands": [
      "ufw"
    ]
  },
  {
    "id": "net-ufw-delete",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Remover uma regra existente do firewall",
    "description": "Exclua a regra que liberava a porta 80/tcp no firewall UFW.",
    "hint": "Execute sudo ufw delete allow 80/tcp",
    "answer": "sudo ufw delete allow 80/tcp",
    "answerSteps": [
      "sudo ufw delete allow 80/tcp"
    ],
    "relatedCommands": [
      "ufw"
    ]
  },
  {
    "id": "net-ufw-disable",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Desativar temporariamente o firewall",
    "description": "Desabilite o firewall UFW do sistema.",
    "hint": "Execute sudo ufw disable",
    "answer": "sudo ufw disable",
    "answerSteps": [
      "sudo ufw disable"
    ],
    "relatedCommands": [
      "ufw"
    ]
  },
  {
    "id": "net-curl-post",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Enviar dados JSON via POST com curl",
    "description": "Envie uma requisição HTTP POST para \"http://localhost/api/members\" com cabeçalho JSON e corpo '{\"name\":\"Tux\"}'.",
    "hint": "Execute curl -X POST -H \"Content-Type: application/json\" -d '{\"name\":\"Tux\"}' http://localhost/api/members",
    "answer": "curl -X POST -H \"Content-Type: application/json\" -d '{\"name\":\"Tux\"}' http://localhost/api/members",
    "answerSteps": [
      "curl -X POST -H \"Content-Type: application/json\" -d '{\"name\":\"Tux\"}' http://localhost/api/members"
    ],
    "relatedCommands": [
      "curl"
    ]
  },
  {
    "id": "net-curl-jq",
    "category": "networking",
    "categoryLabel": "Redes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Consultar API JSON com curl e formatar com jq",
    "description": "Faça uma requisição GET em http://localhost/api/data usando curl e passe a resposta JSON diretamente via pipe para o jq formatar.",
    "hint": "Execute curl -s http://localhost/api/data | jq .",
    "answer": "curl -s http://localhost/api/data | jq .",
    "answerSteps": [
      "curl -s http://localhost/api/data | jq ."
    ],
    "relatedCommands": [
      "curl",
      "jq"
    ]
  },
  {
    "id": "db-tables",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Descobrir tabelas de um banco de dados",
    "description": "Conecte-se ao banco gym.db e descubra quais tabelas existem nele, de forma equivalente a listar arquivos no shell.",
    "hint": "Execute `sqlite3 gym.db .tables`. O .tables é um comando de ponto do sqlite3",
    "answer": "sqlite3 gym.db .tables",
    "answerSteps": [
      "sqlite3 gym.db .tables"
    ],
    "relatedCommands": [
      "sqlite3",
      "ls"
    ]
  },
  {
    "id": "db-schema",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Inspecionar estrutura de colunas de uma tabela",
    "description": "Exiba a definição do esquema de colunas e tipos de dados da tabela 'members' do banco gym.db.",
    "hint": "Execute `sqlite3 gym.db \".schema members\"`. Sem o nome da tabela, aparecem as definições de todas as tabelas",
    "answer": "sqlite3 gym.db \".schema members\"",
    "answerSteps": [
      "sqlite3 gym.db \".schema members\""
    ],
    "relatedCommands": [
      "sqlite3",
      "cat"
    ]
  },
  {
    "id": "db-count",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Totalizar registros cadastrados na tabela",
    "description": "Calcule a quantidade total de registros armazenados na tabela 'members' do banco gym.db.",
    "hint": "Execute `sqlite3 gym.db \"SELECT COUNT(*) FROM members;\"`. Também dá para entrar no modo interativo com `sqlite3 gym.db` e digitar `SELECT COUNT(*) FROM members;` no prompt `sqlite>`. O wc -l members.csv mostra um a mais porque o CSV começa com uma linha de cabeçalho que tem só os nomes das colunas",
    "answer": "sqlite3 gym.db \"SELECT COUNT(*) FROM members;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT COUNT(*) FROM members;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "wc"
    ]
  },
  {
    "id": "db-select-where",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Filtrar registros por critério específico",
    "description": "Consulte na tabela 'members' apenas o nome dos alunos que residem na cidade de \"Tokyo\".",
    "hint": "Execute `sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\"`. Textos ficam entre aspas simples",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\""
    ],
    "relatedCommands": [
      "sqlite3",
      "grep"
    ]
  },
  {
    "id": "db-order-limit",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ordenar e mostrar só as primeiras linhas",
    "description": "Mostre o `name` e a `age` dos 3 membros mais velhos, da maior `age` para a menor (empates em ordem de `name`), com ORDER BY e LIMIT. No Linux (usando members.csv): sort -t, -k5 -rn | head -3.",
    "hint": "Execute `sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age DESC, name LIMIT 3;\"`. DESC significa do maior para o menor",
    "answer": "sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age DESC, name LIMIT 3;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age DESC, name LIMIT 3;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "sort",
      "head"
    ]
  },
  {
    "id": "db-like-search",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Filtrar por padrão de texto com LIKE",
    "description": "Consulte em gym.db o nome dos membros cujo email termina com '@example.com' usando o operador LIKE.",
    "hint": "Execute sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\"",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-null",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Encontrar membros sem e-mail",
    "description": "Mostre o `name` dos membros sem e-mail. `SELECT name FROM members WHERE email = NULL;` retorna 0 linhas, porque NULL não se compara com =. Corrija. No Linux, equivale a `grep -v @ members.csv`.",
    "hint": "Execute `sqlite3 gym.db \"SELECT name FROM members WHERE email IS NULL;\"`. Para saber se falta um valor (NULL), use IS NULL. = NULL não coincide com nenhuma linha",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE email IS NULL;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE email IS NULL;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "grep"
    ]
  },
  {
    "id": "db-boundary",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Conferir o limite de \"ou mais\"",
    "description": "Conte os membros com 20 anos ou mais. `SELECT COUNT(*) FROM members WHERE age > 20;` deixa de fora quem tem exatamente 20. \"20 ou mais\" inclui o limite 20. Corrija para responder à pergunta.",
    "hint": "Execute `sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\"`. >= significa \"ou mais\" (inclui 20); > significa \"maior que\" (não inclui 20)",
    "answer": "sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-between",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Filtrar faixa numérica com BETWEEN",
    "description": "No banco gym.db, selecione `name` e `age` dos membros cuja idade esteja entre 20 e 30 anos (inclusive) utilizando o operador BETWEEN.",
    "hint": "Execute sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\"",
    "answer": "sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-group-count",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Contar por grupo",
    "description": "Conte os membros de cada `city` com GROUP BY. No Linux, isso equivale a `cut -d , -f 4 members.csv | sort | uniq -c`. Execute também: as contagens batem, mas sobra uma linha.",
    "hint": "Execute `sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city;\"`. A linha extra `1 city` na saída do uniq -c vem da linha de cabeçalho do CSV",
    "answer": "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "cut",
      "sort",
      "uniq"
    ]
  },
  {
    "id": "db-sum-avg",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Calcular média numérica com AVG",
    "description": "No banco gym_legacy.db, calcule a média de valor (monthly_fee) da tabela plans usando AVG().",
    "hint": "Execute sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\"",
    "answer": "sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-pipe",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Processar saída de consulta SQL através de filtros shell",
    "description": "Exporte a lista de cidades dos membros em formato CSV e ordene/totalize as ocorrências utilizando pipes do Linux.",
    "hint": "Execute `sqlite3 -csv gym.db \"SELECT city FROM members\" | sort | uniq -c`. Sem o sort, o uniq só junta linhas iguais que estão uma ao lado da outra. As contagens batem com o resultado do GROUP BY do desafio anterior",
    "answer": "sqlite3 -csv gym.db \"SELECT city FROM members\" | sort | uniq -c",
    "answerSteps": [
      "sqlite3 -csv gym.db \"SELECT city FROM members\" | sort | uniq -c"
    ],
    "relatedCommands": [
      "sqlite3",
      "sort",
      "uniq"
    ]
  },
  {
    "id": "db-create-table",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Criar uma nova tabela no SQLite",
    "description": "No banco gym.db, crie uma nova tabela chamada \"workouts\" com as colunas \"id INTEGER PRIMARY KEY\" e \"title TEXT\" e observe-a aparecer no Painel SQL.",
    "hint": "Execute sqlite3 gym.db \"CREATE TABLE workouts (id INTEGER PRIMARY KEY, title TEXT);\"",
    "answer": "sqlite3 gym.db \"CREATE TABLE workouts (id INTEGER PRIMARY KEY, title TEXT);\"",
    "answerSteps": [
      "sqlite3 gym.db \"CREATE TABLE workouts (id INTEGER PRIMARY KEY, title TEXT);\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-insert-into",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Inserir novo membro na tabela (INSERT INTO)",
    "description": "Matricule o novo aluno 'Tux' (id 13, email 'tux@example.com', cidade 'Tokyo', idade 25) na tabela members de gym.db.",
    "hint": "Execute sqlite3 gym.db \"INSERT INTO members (id, name, email, city, age) VALUES (13, 'Tux', 'tux@example.com', 'Tokyo', 25);\"",
    "answer": "sqlite3 gym.db \"INSERT INTO members (id, name, email, city, age) VALUES (13, 'Tux', 'tux@example.com', 'Tokyo', 25);\"",
    "answerSteps": [
      "sqlite3 gym.db \"INSERT INTO members (id, name, email, city, age) VALUES (13, 'Tux', 'tux@example.com', 'Tokyo', 25);\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-update-where",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Atualizar registro específico no banco",
    "description": "No banco gym_legacy.db, atualize a cidade do aluno de código (id) 3 para \"Osaka\", modificando estritamente essa linha.",
    "hint": "Primeiro execute `sqlite3 gym_legacy.db \"SELECT COUNT(*) FROM members WHERE id = 3;\"` para confirmar 1 linha e depois `sqlite3 gym_legacy.db \"UPDATE members SET city = 'Osaka' WHERE id = 3;\"`. Sem WHERE, a city de todos os membros muda",
    "answer": "sqlite3 gym_legacy.db \"UPDATE members SET city = 'Osaka' WHERE id = 3;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"UPDATE members SET city = 'Osaka' WHERE id = 3;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-delete-where",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Excluir registro específico com DELETE WHERE",
    "description": "No banco gym_legacy.db, remova exclusivamente o membro de id = 10 (Leo) da tabela members.",
    "hint": "Execute sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\"",
    "answer": "sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-join",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Juntar tabelas para mostrar o plano atual",
    "description": "A partir daqui, use o `gym_legacy.db`: dados migrados de um sistema antigo, com linhas de histórico de troca de plano. Mostre o `name` de cada membro e o nome do plano atual com JOIN.",
    "hint": "Execute `sqlite3 gym_legacy.db \"SELECT m.name, p.name FROM members m JOIN enrollments e ON e.member_id = m.id JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL;\"`. As linhas de planos antigos têm a data de término em ended_at. Sem esse filtro, um membro vira várias linhas",
    "answer": "sqlite3 gym_legacy.db \"SELECT m.name, p.name FROM members m JOIN enrollments e ON e.member_id = m.id JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT m.name, p.name FROM members m JOIN enrollments e ON e.member_id = m.id JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-left-join",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Encontrar membros que nunca se inscreveram",
    "description": "No `gym_legacy.db`, mostre o `name` dos membros sem nenhuma linha em `enrollments` (nunca se inscreveram). O JOIN comum descarta quem não tem par; o LEFT JOIN os mantém.",
    "hint": "Execute `sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\"`. O LEFT JOIN mantém as linhas sem par e preenche as colunas que faltam com NULL. NOT IN ou NOT EXISTS também funcionam",
    "answer": "sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-having",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Filtrar grupos agregados com HAVING",
    "description": "No banco gym.db, conte os membros por cidade (GROUP BY city) exibindo somente as cidades com mais de 2 membros usando HAVING COUNT(*) > 2.",
    "hint": "Execute sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\"",
    "answer": "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "auto-bash-hello",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Seu primeiro robô com Shebang (#!/bin/bash)",
    "description": "Todo script de automação começa com a linha `#!/bin/bash` (shebang) para indicar qual interpretador deve executá-lo.\nCrie `organiza.sh` contendo `#!/bin/bash` e `echo \"Iniciando automacao...\"`, torne-o executável com `chmod +x organiza.sh` e rode `./organiza.sh`.",
    "hint": "Use `printf '#!/bin/bash\\necho \"Iniciando automacao...\"\\n' > organiza.sh && chmod +x organiza.sh && ./organiza.sh` (ou edite com `nano organiza.sh`).",
    "answer": "printf '#!/bin/bash\\necho \"Iniciando automacao...\"\\n' > organiza.sh && chmod +x organiza.sh && ./organiza.sh",
    "answerSteps": [
      "printf '#!/bin/bash\\necho \"Iniciando automacao...\"\\n' > organiza.sh",
      "chmod +x organiza.sh",
      "./organiza.sh"
    ],
    "relatedCommands": [
      "nano",
      "chmod",
      "bash"
    ]
  },
  {
    "id": "auto-bash-vars-date",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Nomes dinâmicos com variáveis e $(date)",
    "description": "Em automações diárias, gerar arquivos com data automática evita sobrescrever relatórios anteriores.\nCrie a pasta `~/logs` e gere um arquivo com a data de hoje usando `$(date +%Y-%m-%d)` chamado `relatorio_<DATA>.log` dentro de `~/logs/`.",
    "hint": "Execute `mkdir -p ~/logs && echo \"Status OK\" > ~/logs/relatorio_$(date +%Y-%m-%d).log`",
    "answer": "mkdir -p ~/logs && echo \"Status OK\" > ~/logs/relatorio_$(date +%Y-%m-%d).log",
    "answerSteps": [
      "mkdir -p ~/logs",
      "echo \"Status OK\" > ~/logs/relatorio_$(date +%Y-%m-%d).log"
    ],
    "relatedCommands": [
      "date",
      "mkdir",
      "echo"
    ]
  },
  {
    "id": "auto-bash-logging",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Gravar saída e erros em log automático (>> e 2>&1)",
    "description": "Scripts agendados rodam sem ninguém olhando a tela: se não registrarem saída e erros em arquivo, falhas passam despercebidas.\nExecute `./rotina.sh` acumulando tanto stdout quanto stderr em `automacao.log` (`>> automacao.log 2>&1`).",
    "hint": "Execute `./rotina.sh >> automacao.log 2>&1`",
    "answer": "./rotina.sh >> automacao.log 2>&1",
    "answerSteps": [
      "./rotina.sh >> automacao.log 2>&1"
    ],
    "relatedCommands": [
      "cat",
      "tail",
      "logger"
    ]
  },
  {
    "id": "auto-bash-prep-dirs",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar pastas de organização de uma vez ({...})",
    "description": "Antes de um script organizar sua pasta `downloads/`, ele deve garantir que os diretórios de destino existam.\nCrie de uma única vez `downloads/imagens`, `downloads/documentos` e `downloads/arquivos` usando expansão de chaves.",
    "hint": "Execute `mkdir -p downloads/{imagens,documentos,arquivos}`",
    "answer": "mkdir -p downloads/{imagens,documentos,arquivos}",
    "answerSteps": [
      "mkdir -p downloads/{imagens,documentos,arquivos}"
    ],
    "relatedCommands": [
      "mkdir",
      "tree",
      "ls"
    ]
  },
  {
    "id": "auto-bash-glob-move",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Triagem automática em lote por extensão (Globbing)",
    "description": "A pasta `downloads/` está misturada com `.pdf`, `.jpg`, `.png` e `.zip`.\nMova todos os `.pdf` para `downloads/documentos/` e todas as imagens (`.jpg` e `.png`) para `downloads/imagens/` usando padrões `*`.",
    "hint": "Execute `mv downloads/*.pdf downloads/documentos/ && mv downloads/*.jpg downloads/*.png downloads/imagens/`",
    "answer": "mv downloads/*.pdf downloads/documentos/ && mv downloads/*.jpg downloads/*.png downloads/imagens/",
    "answerSteps": [
      "mv downloads/*.pdf downloads/documentos/",
      "mv downloads/*.jpg downloads/*.png downloads/imagens/"
    ],
    "relatedCommands": [
      "mv",
      "ls",
      "find"
    ]
  },
  {
    "id": "auto-bash-organizer-script",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Script organizador com laço for e condicional [ -f ]",
    "description": "Em vez de digitar `mv` todo dia, transforme a triagem em um script executável!\nCrie `organizar_downloads.sh` com um laço `for` e teste `[ -f \"$f\" ]` para mover `.pdf` para `downloads/documentos/` e `.png` para `downloads/imagens/`. Dê `+x` e execute `./organizar_downloads.sh`.",
    "hint": "Crie `organizar_downloads.sh` usando `for f in downloads/*.pdf; do if [ -f \"$f\" ]; then mv \"$f\" downloads/documentos/; fi; done` (e outro para `.png`), depois `chmod +x organizar_downloads.sh && ./organizar_downloads.sh`.",
    "answer": "printf '#!/bin/bash\\nfor f in downloads/*.pdf; do\\n  if [ -f \"$f\" ]; then\\n    mv \"$f\" downloads/documentos/\\n  fi\\ndone\\nfor f in downloads/*.png; do\\n  if [ -f \"$f\" ]; then\\n    mv \"$f\" downloads/imagens/\\n  fi\\ndone\\n' > organizar_downloads.sh && chmod +x organizar_downloads.sh && ./organizar_downloads.sh",
    "answerSteps": [
      "printf '#!/bin/bash\\nfor f in downloads/*.pdf; do\\n  if [ -f \"$f\" ]; then\\n    mv \"$f\" downloads/documentos/\\n  fi\\ndone\\nfor f in downloads/*.png; do\\n  if [ -f \"$f\" ]; then\\n    mv \"$f\" downloads/imagens/\\n  fi\\ndone\\n' > organizar_downloads.sh",
      "chmod +x organizar_downloads.sh",
      "./organizar_downloads.sh"
    ],
    "relatedCommands": [
      "nano",
      "chmod",
      "mv"
    ]
  },
  {
    "id": "auto-bash-cleanup-tmp",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Faxina automática e segura de temporários (*.tmp)",
    "description": "Em scripts de limpeza, evite `rm -rf` genérico: filtre exatamente o tipo de arquivo descartável antes de apagar.\nRemova apenas arquivos `.tmp` dentro de `downloads/` preservando `importante.txt`.",
    "hint": "Execute `find downloads -type f -name \"*.tmp\" -delete`",
    "answer": "find downloads -type f -name \"*.tmp\" -delete",
    "answerSteps": [
      "find downloads -type f -name \"*.tmp\" -delete"
    ],
    "relatedCommands": [
      "find",
      "rm",
      "ls"
    ]
  },
  {
    "id": "auto-bash-rsync-local",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Espelhamento incremental local com rsync -av",
    "description": "Diferente de `cp -r` que recopia tudo sempre, o `rsync` analisa diferenças e transfere apenas arquivos novos ou modificados.\nEspelhe o conteúdo de `documents/` para `backups/documents/` usando `rsync -av`.",
    "hint": "Execute `rsync -av documents/ backups/documents/`",
    "answer": "rsync -av documents/ backups/documents/",
    "answerSteps": [
      "rsync -av documents/ backups/documents/"
    ],
    "relatedCommands": [
      "rsync",
      "ls",
      "cp"
    ]
  },
  {
    "id": "auto-bash-rsync-dryrun",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Simular backup destrutivo com --dry-run (-n) antes de aplicar",
    "description": "A opção `--delete` remove do destino arquivos que não existem mais na origem — perigosa sem revisão prévia! A pasta `backups/documents/` possui `obsoleto.txt`.\nSimule `rsync --delete` com `-n` (`--dry-run`) para conferir o que seria apagado sem apagar nada ainda.",
    "hint": "Execute `rsync -avn --delete documents/ backups/documents/`",
    "answer": "rsync -avn --delete documents/ backups/documents/",
    "answerSteps": [
      "rsync -avn --delete documents/ backups/documents/"
    ],
    "relatedCommands": [
      "rsync",
      "ls"
    ]
  },
  {
    "id": "auto-bash-backup-tar-verify",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Backup compactado validando código de retorno (&&)",
    "description": "Um bom script de backup nunca assume que deu certo: ele valida o status de retorno (`0`) antes de registrar sucesso.\nCrie/execute `backup.sh` compactando `documents` em `backups/docs_backup.tar.gz` com `tar -czf` e só exiba `Backup OK` se o `tar` tiver sucesso.",
    "hint": "Execute `printf '#!/bin/bash\\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\\n' > backup.sh && chmod +x backup.sh && ./backup.sh`",
    "answer": "printf '#!/bin/bash\\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\\n' > backup.sh && chmod +x backup.sh && ./backup.sh",
    "answerSteps": [
      "printf '#!/bin/bash\\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\\n' > backup.sh",
      "chmod +x backup.sh",
      "./backup.sh"
    ],
    "relatedCommands": [
      "tar",
      "chmod",
      "echo"
    ]
  },
  {
    "id": "auto-bash-disk-alert",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Sentinela de disco com df, awk e condicional -gt",
    "description": "Scripts de monitoramento tomam decisões lendo métricas do sistema.\nNo simulador, a partição `/` está em `24%` de uso. Crie e rode `checa_disco.sh` extraindo esse percentual (`df -h / | awk '/sda1/ {print $5}' | tr -d '%'`) e imprimindo `ALERTA: Disco alto` quando for maior que `20` (`-gt 20`).",
    "hint": "Use `printf '#!/bin/bash\\nUSO=$(df -h / | awk '''/sda1/ {print $5}''' | tr -d '''%''')\\nif [ \"$USO\" -gt 20 ]; then\\n  echo \"ALERTA: Disco alto (${USO}%%)\"\\nfi\\n' > checa_disco.sh && chmod +x checa_disco.sh && ./checa_disco.sh`",
    "answer": "printf '#!/bin/bash\\nUSO=$(df -h / | awk '\\''/sda1/ {print $5}'\\'' | tr -d '\\''%'\\'')\\nif [ \"$USO\" -gt 20 ]; then\\n  echo \"ALERTA: Disco alto (${USO}%%)\"\\nfi\\n' > checa_disco.sh && chmod +x checa_disco.sh && ./checa_disco.sh",
    "answerSteps": [
      "printf '#!/bin/bash\\nUSO=$(df -h / | awk '\\''/sda1/ {print $5}'\\'' | tr -d '\\''%'\\'')\\nif [ \"$USO\" -gt 20 ]; then\\n  echo \"ALERTA: Disco alto (${USO}%%)\"\\nfi\\n' > checa_disco.sh",
      "chmod +x checa_disco.sh",
      "./checa_disco.sh"
    ],
    "relatedCommands": [
      "df",
      "awk",
      "test"
    ]
  },
  {
    "id": "auto-bash-service-watchdog",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Autocorreção (Watchdog) de serviço com systemctl",
    "description": "O serviço `nginx` caiu! Em vez de acordar às 3h da manhã, automações de health-check verificam se o serviço está ativo e o reiniciam automaticamente em caso de falha (`||`).\nCrie `watchdog.sh` com `systemctl is-active nginx || sudo systemctl start nginx` e execute `./watchdog.sh` para recuperar o Nginx.",
    "hint": "Execute `printf '#!/bin/bash\\nsystemctl is-active nginx || sudo systemctl start nginx\\n' > watchdog.sh && chmod +x watchdog.sh && ./watchdog.sh`",
    "answer": "printf '#!/bin/bash\\nsystemctl is-active nginx || sudo systemctl start nginx\\n' > watchdog.sh && chmod +x watchdog.sh && ./watchdog.sh",
    "answerSteps": [
      "printf '#!/bin/bash\\nsystemctl is-active nginx || sudo systemctl start nginx\\n' > watchdog.sh",
      "chmod +x watchdog.sh",
      "./watchdog.sh"
    ],
    "relatedCommands": [
      "systemctl",
      "chmod",
      "journalctl"
    ]
  },
  {
    "id": "auto-bash-cron-schedule",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Agendar execução diária automática no crontab",
    "description": "O `cron` usa 5 campos antes do comando: `minuto hora dia mês dia_da_semana`.\nAgende `/home/user/organizar_downloads.sh` para rodar todos os dias às `02:30` (`30 2 * * *`), redirecionando logs para `/home/user/cron.log` (`>> ... 2>&1`).",
    "hint": "Você pode editar via `crontab -e` ou instalar via pipe: `printf '30 2 * * * /home/user/organizar_downloads.sh >> /home/user/cron.log 2>&1\\n' | crontab -`",
    "answer": "printf '30 2 * * * /home/user/organizar_downloads.sh >> /home/user/cron.log 2>&1\\n' | crontab - && crontab -l",
    "answerSteps": [
      "printf '30 2 * * * /home/user/organizar_downloads.sh >> /home/user/cron.log 2>&1\\n' | crontab -",
      "crontab -l"
    ],
    "relatedCommands": [
      "crontab",
      "logger",
      "chmod"
    ]
  },
  {
    "id": "auto-bash-boss-pipeline",
    "category": "automation-bash",
    "categoryLabel": "Auto Bash",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🏆 Projeto Final Bash: Rotina Noturna Autônoma",
    "description": "Combine tudo em um único robô `rotina_noturna.sh` que: 1) move `.pdf` de `downloads/` para `downloads/documentos/`, 2) apaga `.tmp` em `downloads/`, 3) sincroniza `documents/` em `backups/documents/` com `rsync -a`, e 4) registra `Rotina OK` em `rotina.log`.\nCrie, execute `./rotina_noturna.sh` e agende às `03:00` no crontab!",
    "hint": "Monte `rotina_noturna.sh`, dê `chmod +x`, execute `./rotina_noturna.sh` e grave `0 3 * * * /home/user/rotina_noturna.sh` no `crontab`.",
    "answer": "printf '#!/bin/bash\\nmv downloads/*.pdf downloads/documentos/\\nfind downloads -type f -name \"*.tmp\" -delete\\nrsync -a documents/ backups/documents/\\necho \"Rotina OK\" >> rotina.log\\n' > rotina_noturna.sh && chmod +x rotina_noturna.sh && ./rotina_noturna.sh && printf '0 3 * * * /home/user/rotina_noturna.sh >> /home/user/rotina.log 2>&1\\n' | crontab -",
    "answerSteps": [
      "printf '#!/bin/bash\\nmv downloads/*.pdf downloads/documentos/\\nfind downloads -type f -name \"*.tmp\" -delete\\nrsync -a documents/ backups/documents/\\necho \"Rotina OK\" >> rotina.log\\n' > rotina_noturna.sh",
      "chmod +x rotina_noturna.sh",
      "./rotina_noturna.sh",
      "printf '0 3 * * * /home/user/rotina_noturna.sh >> /home/user/rotina.log 2>&1\\n' | crontab -"
    ],
    "relatedCommands": [
      "rsync",
      "crontab",
      "find"
    ]
  },
  {
    "id": "ansible-ssh-prep",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "A base do Ansible: gerar par de chaves SSH",
    "description": "Ao contrário de outras ferramentas, o Ansible não exige instalar agentes nos servidores — ele opera sobre **SSH**! Por isso, o primeiro passo do controlador é ter um par de chaves criptográficas em `~/.ssh/`.\nGere uma chave Ed25519 usando `ssh-keygen -t ed25519`.",
    "hint": "Execute `ssh-keygen -t ed25519`",
    "answer": "ssh-keygen -t ed25519",
    "answerSteps": [
      "ssh-keygen -t ed25519"
    ],
    "relatedCommands": [
      "ssh-keygen",
      "ssh",
      "ls"
    ]
  },
  {
    "id": "ansible-inventory-ini",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Criar arquivo de Inventário INI (inventory.ini)",
    "description": "O inventário diz ao Ansible quais servidores existem e como se agrupam por função.\nCrie `inventory.ini` no diretório atual definindo o grupo `[webservers]` com `web1` e `web2`, e o grupo `[databases]` com `db1`.",
    "hint": "Use `printf '[webservers]\\nweb1\\nweb2\\n\\n[databases]\\ndb1\\n' > inventory.ini` (ou edite com `nano inventory.ini`).",
    "answer": "printf '[webservers]\\nweb1\\nweb2\\n\\n[databases]\\ndb1\\n' > inventory.ini",
    "answerSteps": [
      "printf '[webservers]\\nweb1\\nweb2\\n\\n[databases]\\ndb1\\n' > inventory.ini"
    ],
    "relatedCommands": [
      "ansible",
      "nano",
      "cat"
    ]
  },
  {
    "id": "ansible-adhoc-ping",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Testar conectividade na frota com -m ping",
    "description": "O módulo `ping` do Ansible não envia ICMP de rede: ele valida conexão SSH, autenticação e disponibilidade do Python nos hosts do inventário, retornando `pong`.\nTeste todos os servidores (`all`) usando `inventory.ini`.",
    "hint": "Execute `ansible all -i inventory.ini -m ping`",
    "answer": "ansible all -i inventory.ini -m ping",
    "answerSteps": [
      "ansible all -i inventory.ini -m ping"
    ],
    "relatedCommands": [
      "ansible",
      "ssh-keygen"
    ]
  },
  {
    "id": "ansible-adhoc-shell",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Rodar comandos ad-hoc em grupo de servidores (-m shell)",
    "description": "Para checagens rápidas sem precisar abrir SSH servidor por servidor, o modo *ad-hoc* executa um comando em todo um grupo de uma vez.\nVerifique `uptime && df -h` somente no grupo `webservers` (`web1` e `web2`).",
    "hint": "Execute `ansible webservers -i inventory.ini -m shell -a \"uptime && df -h\"`",
    "answer": "ansible webservers -i inventory.ini -m shell -a \"uptime && df -h\"",
    "answerSteps": [
      "ansible webservers -i inventory.ini -m shell -a \"uptime && df -h\""
    ],
    "relatedCommands": [
      "ansible",
      "df",
      "uptime"
    ]
  },
  {
    "id": "ansible-facts-setup",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Coletar metadados do sistema (Facts) com -m setup",
    "description": "Antes de aplicar regras, o Ansible coleta automaticamente informações do sistema operacional, IP e memória de cada host (chamadas de **Facts**).\nInspecione os fatos do servidor `db1` usando o módulo `setup`.",
    "hint": "Execute `ansible db1 -i inventory.ini -m setup`",
    "answer": "ansible db1 -i inventory.ini -m setup",
    "answerSteps": [
      "ansible db1 -i inventory.ini -m setup"
    ],
    "relatedCommands": [
      "ansible"
    ]
  },
  {
    "id": "ansible-adhoc-copy",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Distribuir arquivo e permissão para os servidores (-m copy)",
    "description": "O arquivo local `index.html` precisa ir para `/var/www/html/index.html` com permissão `0644` em todos os `webservers`. Como escreve em `/var/`, use `--become` (`-b`) para elevar privilégio.\nEnvie o arquivo com `-m copy`.",
    "hint": "Execute `ansible webservers -i inventory.ini -b -m copy -a \"src=index.html dest=/var/www/html/index.html mode=0644\"`",
    "answer": "ansible webservers -i inventory.ini -b -m copy -a \"src=index.html dest=/var/www/html/index.html mode=0644\"",
    "answerSteps": [
      "ansible webservers -i inventory.ini -b -m copy -a \"src=index.html dest=/var/www/html/index.html mode=0644\""
    ],
    "relatedCommands": [
      "ansible",
      "scp"
    ]
  },
  {
    "id": "ansible-adhoc-apt-service",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Instalar pacote (-m apt) e iniciar serviço (-m service) com -b",
    "description": "Em vez de enviar `apt install` via shell bruto, módulos declarativos garantem o estado final desejado sem erro se já estiver instalado.\nEm `webservers`, instale `nginx` (`state=present`) e inicie/habilite o serviço (`state=started enabled=yes`) usando `-b`.",
    "hint": "Execute `ansible webservers -i inventory.ini -b -m apt -a \"name=nginx state=present\" && ansible webservers -i inventory.ini -b -m service -a \"name=nginx state=started enabled=yes\"`",
    "answer": "ansible webservers -i inventory.ini -b -m apt -a \"name=nginx state=present\" && ansible webservers -i inventory.ini -b -m service -a \"name=nginx state=started enabled=yes\"",
    "answerSteps": [
      "ansible webservers -i inventory.ini -b -m apt -a \"name=nginx state=present\"",
      "ansible webservers -i inventory.ini -b -m service -a \"name=nginx state=started enabled=yes\""
    ],
    "relatedCommands": [
      "ansible",
      "apt",
      "systemctl"
    ]
  },
  {
    "id": "ansible-first-playbook",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Escrever e executar seu primeiro Playbook YAML (webserver.yml)",
    "description": "Comandos ad-hoc são pontuais; **Playbooks YAML** transformam infraestrutura em código reutilizável e versionado no Git.\nCrie `webserver.yml` declarando `hosts: webservers`, `become: yes` e duas `tasks` (`apt` para `nginx` e `service` para iniciar/habilitar `nginx`), e rode com `ansible-playbook`.",
    "hint": "Crie `webserver.yml` e execute `ansible-playbook -i inventory.ini webserver.yml`.",
    "answer": "printf '%s\\n' '- name: Configurar servidores web' '  hosts: webservers' '  become: yes' '  tasks:' '    - name: Instalar nginx' '      apt: name=nginx state=present' '    - name: Iniciar nginx' '      service: name=nginx state=started enabled=yes' > webserver.yml && ansible-playbook -i inventory.ini webserver.yml",
    "answerSteps": [
      "printf '%s\\n' '- name: Configurar servidores web' '  hosts: webservers' '  become: yes' '  tasks:' '    - name: Instalar nginx' '      apt: name=nginx state=present' '    - name: Iniciar nginx' '      service: name=nginx state=started enabled=yes' > webserver.yml",
      "ansible-playbook -i inventory.ini webserver.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "nano",
      "cat"
    ]
  },
  {
    "id": "ansible-idempotency-check",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Comprovar Idempotência na prática (changed=0)",
    "description": "Em Bash, rodar um script duas vezes pode duplicar linhas ou falhar. No Ansible, **idempotência** garante que se o servidor já está no estado desejado (`webserver.yml` já aplicado), rodar de novo resulta em `changed=0` e tudo `ok`.\nExecute `webserver.yml` novamente e confira o `PLAY RECAP`!",
    "hint": "Execute `ansible-playbook -i inventory.ini webserver.yml`",
    "answer": "ansible-playbook -i inventory.ini webserver.yml",
    "answerSteps": [
      "ansible-playbook -i inventory.ini webserver.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "cat"
    ]
  },
  {
    "id": "ansible-check-diff",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Simular alterações em segurança com --check --diff",
    "description": "Antes de aplicar `deploy.yml` em produção, faça um ensaio (*dry-run*) para ver exatamente quais linhas mudariam sem alterar nenhum servidor.\nExecute `ansible-playbook` com `--check` e `--diff`.",
    "hint": "Execute `ansible-playbook -i inventory.ini deploy.yml --check --diff`",
    "answer": "ansible-playbook -i inventory.ini deploy.yml --check --diff",
    "answerSteps": [
      "ansible-playbook -i inventory.ini deploy.yml --check --diff"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "diff"
    ]
  },
  {
    "id": "ansible-vars-lineinfile",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Variáveis YAML (vars) e edição segura com lineinfile",
    "description": "Usar `echo ... >> /etc/app.conf` em Bash duplica linhas toda vez que roda. O módulo `lineinfile` insere a linha somente se ainda não existir, usando variáveis como `{{ app_env }}`.\nInspecione `cat vars_app.yml` e execute o playbook nos servidores.",
    "hint": "Execute `ansible-playbook -i inventory.ini vars_app.yml`",
    "answer": "ansible-playbook -i inventory.ini vars_app.yml",
    "answerSteps": [
      "cat vars_app.yml",
      "ansible-playbook -i inventory.ini vars_app.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "cat"
    ]
  },
  {
    "id": "ansible-handlers-notify",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Reiniciar serviço somente se houver mudança (notify/handlers)",
    "description": "Reiniciar o Nginx à toa derruba conexões abertas! O bloco `handlers:` só executa quando uma tarefa com `notify:` realmente muda algo (`changed=true`).\nInspecione `nginx_config.yml` e execute o playbook para disparar o handler `Restart nginx`.",
    "hint": "Execute `ansible-playbook -i inventory.ini nginx_config.yml`",
    "answer": "ansible-playbook -i inventory.ini nginx_config.yml",
    "answerSteps": [
      "cat nginx_config.yml",
      "ansible-playbook -i inventory.ini nginx_config.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "cat"
    ]
  },
  {
    "id": "ansible-loop-when",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Evitar repetição com loop e filtrar hosts com when",
    "description": "O arquivo `loop_when.yml` instala `curl`, `htop` e `jq` via `loop:` em toda a frota, mas libera a porta 80 no `ufw` **apenas** `when: inventory_hostname in groups['webservers']` (pulando `db1` como `skipping`).\nExecute o playbook para observar esse comportamento!",
    "hint": "Execute `ansible-playbook -i inventory.ini loop_when.yml`",
    "answer": "ansible-playbook -i inventory.ini loop_when.yml",
    "answerSteps": [
      "cat loop_when.yml",
      "ansible-playbook -i inventory.ini loop_when.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "ufw",
      "cat"
    ]
  },
  {
    "id": "ansible-boss-deploy",
    "category": "ansible",
    "categoryLabel": "Ansible",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🏆 Projeto Final Ansible: Stack Multi-Host Idempotente",
    "description": "O playbook `infra.yml` provisiona toda a arquitetura (`web1`, `web2` e `db1`): usuário `deploy`, pacotes base, Nginx, config com handler, página HTML e firewall.\nExecute `infra.yml` **duas vezes**: na 1ª aplica toda a infraestrutura (`changed > 0`), e na 2ª comprova idempotência total (`changed=0` e `failed=0`)!",
    "hint": "Execute `ansible-playbook -i inventory.ini infra.yml && ansible-playbook -i inventory.ini infra.yml`",
    "answer": "ansible-playbook -i inventory.ini infra.yml && ansible-playbook -i inventory.ini infra.yml",
    "answerSteps": [
      "ansible-playbook -i inventory.ini infra.yml",
      "ansible-playbook -i inventory.ini infra.yml"
    ],
    "relatedCommands": [
      "ansible-playbook",
      "ansible",
      "cat"
    ]
  },
  {
    "id": "inc-nginx-404",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #1: Alerta 404 no Nginx",
    "description": "O monitoramento reportou um erro 404 suspeito no servidor web. Investigue o log /var/log/nginx/access.log para encontrar a requisição 404 e confirme em seguida quais portas TCP estão em escuta no servidor.",
    "hint": "Filtre o erro 404 com grep 404 /var/log/nginx/access.log e liste as portas com ss -tulpn",
    "answer": "grep 404 /var/log/nginx/access.log && ss -tulpn",
    "answerSteps": [
      "grep 404 /var/log/nginx/access.log",
      "ss -tulpn"
    ],
    "relatedCommands": [
      "grep",
      "ss",
      "cat"
    ]
  },
  {
    "id": "inc-postgresql-down",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #2: Banco PostgreSQL fora do ar",
    "description": "A aplicação está sem banco! Verifique se o serviço postgresql está ativo, inicie-o imediatamente e habilite-o para subir automaticamente no boot.",
    "hint": "Rode systemctl is-active postgresql (ou status), depois sudo systemctl start postgresql e sudo systemctl enable postgresql",
    "answer": "sudo systemctl start postgresql && sudo systemctl enable postgresql",
    "answerSteps": [
      "systemctl status postgresql",
      "sudo systemctl start postgresql",
      "sudo systemctl enable postgresql"
    ],
    "relatedCommands": [
      "systemctl",
      "sudo"
    ]
  },
  {
    "id": "inc-git-secret-leak",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #3: Segredo .env prestes a ser commitado!",
    "description": "Alguém deu git add no arquivo de senhas \".env\" junto com \"app.js\"! Tire o \".env\" da área de stage sem apagar o arquivo e faça o commit apenas de \"app.js\".",
    "hint": "Use git restore --staged .env e depois git commit -m \"deploy app\"",
    "answer": "git restore --staged .env && git commit -m \"deploy app\"",
    "answerSteps": [
      "git status",
      "git restore --staged .env",
      "git commit -m \"deploy app\""
    ],
    "relatedCommands": [
      "git"
    ]
  },
  {
    "id": "inc-docker-conflict",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #4: Contêiner travado impedindo limpeza",
    "description": "Você precisa remover a imagem \"nginx\", mas o contêiner \"travado\" está ativo usando essa imagem. Pare o contêiner, remova-o e só então remova a imagem nginx.",
    "hint": "Execute docker stop travado, depois docker rm travado e por fim docker rmi nginx",
    "answer": "docker stop travado && docker rm travado && docker rmi nginx",
    "answerSteps": [
      "docker stop travado",
      "docker rm travado",
      "docker rmi nginx"
    ],
    "relatedCommands": [
      "docker"
    ]
  },
  {
    "id": "inc-backup-pipeline",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #5: Pipeline completo de backup (SQL + Gzip + Hash)",
    "description": "Exporte em CSV os nomes dos membros de 'Tokyo' do gym.db para \"tokyo.csv\", comprima o arquivo mantendo o original (-k) e calcule o hash SHA-256 de \"tokyo.csv.gz\".",
    "hint": "Execute sqlite3 -csv gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\" > tokyo.csv, depois gzip -k tokyo.csv e por fim sha256sum tokyo.csv.gz",
    "answer": "sqlite3 -csv gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\" > tokyo.csv && gzip -k tokyo.csv && sha256sum tokyo.csv.gz",
    "answerSteps": [
      "sqlite3 -csv gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\" > tokyo.csv",
      "gzip -k tokyo.csv",
      "sha256sum tokyo.csv.gz"
    ],
    "relatedCommands": [
      "sqlite3",
      "gzip",
      "sha256sum"
    ]
  },
  {
    "id": "inc-script-perm-fix",
    "category": "incidents",
    "categoryLabel": "Incidentes",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🚨 Incidente #6: Script de deploy sem permissão de execução",
    "description": "Um colega deixou o script \"/home/user/deploy.sh\" pronto, mas a execução direta falha com \"Permissão negada\". Adicione permissão de execução (+x) e rode ./deploy.sh.",
    "hint": "Execute chmod +x deploy.sh && ./deploy.sh",
    "answer": "chmod +x deploy.sh && ./deploy.sh",
    "answerSteps": [
      "chmod +x deploy.sh",
      "./deploy.sh"
    ],
    "relatedCommands": [
      "ls -l",
      "chmod"
    ]
  }
];

