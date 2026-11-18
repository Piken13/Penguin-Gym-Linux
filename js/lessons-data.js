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
    "description": "No Bash, `echo 15 + 5` imprime texto literal em vez de somar! Para o shell calcular números inteiros, envolvemos a conta em `$(( ... ))` (**expansão aritmética**).\nCalcule `(15 + 5) * 2` usando `$(( ... ))` e exiba o resultado com `echo`.",
    "hint": "**Por que parênteses duplos?**\n• `$(( conta ))` avisa ao Bash para resolver a operação matemática antes do `echo`.\n• Parênteses internos agrupam a soma como na matemática: `echo $(( (15 + 5) * 2 ))` → imprime `40`.",
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
    "description": "Todo comando no Linux termina deixando um código invisível na variável especial `$?`: **`0`** significa *sucesso*, qualquer outro número significa *erro*.\nExiba esse código no terminal com `echo $?`.",
    "hint": "**Dica prática do dia a dia:**\n• `$?` sempre guarda o status apenas do **último** comando rodado (e um novo `echo $?` sobrescreve o anterior com `0`!).\n• Execute `echo $?` para conferir o status atual.",
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
    "description": "Um `alias` cria um apelido curto para comandos que você digita toda hora.\nCrie um atalho chamado `'c'` que execute `clear` para limpar a tela.",
    "hint": "**Pegadinha de sintaxe no Bash:**\n**Não coloque espaços ao redor do `=`!** (`alias c = 'clear'` dá erro).\n• O formato correto é: `alias c='clear'`",
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
    "description": "Quer descobrir quais apelidos (como `ll` ou `la`) já existem na sua sessão atual?\nExecute o comando `alias` sem argumentos para listar todos.",
    "hint": "Digite apenas `alias` e aperte Enter para listar todas as definições ativas no shell atual.",
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
    "description": "Se um `alias` está conflitando com um programa real ou você não quer mais aquele atalho na sessão, usamos `unalias`.\nRemova o atalho `'c'` que foi criado.",
    "hint": "Passe apenas o nome do atalho (sem `=`): `unalias c`.",
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
    "description": "Esqueceu o comando enorme que você rodou há 5 minutos? O Bash guarda um registro numerado dos comandos da sessão.\nExiba a lista com `history`.",
    "hint": "Execute `history` para listar os comandos recentes numerados (dica: no terminal, `Ctrl+R` também faz busca rápida no histórico!).",
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
    "description": "O operador `!!` (*bang-bang*) substitui e executa exatamente o comando anterior do histórico — muito usado quando esquecemos de digitar `sudo` antes (ex.: `sudo !!`).\nRepita o comando mais recente (desde que válido) usando `!!`.",
    "hint": "**Atenção antes de rodar:** `!!` repete o **último comando** digitado (se o último comando deu erro, rode um comando válido como `pwd` ou `ls` antes!).\nDepois digite `!!` e pressione Enter.",
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
    "description": "Uma variável comum (`GYM_ENV=production`) fica visível só no terminal atual. O comando `export` transforma em **variável de ambiente**, permitindo que Node/Python/scripts filhos iniciados aqui leiam o valor.\nCrie e exporte `GYM_ENV` com o valor `\"production\"`.",
    "hint": "**Lembre da regra do `=` no Bash:** zero espaços antes ou depois do `=`!\nExecute `export GYM_ENV=production` (confira se quiser com `echo $GYM_ENV`).",
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
    "description": "O operador `>` sozinho redireciona só a saída normal (canal **`1`**), deixando erros aparecerem na tela. Para capturar apenas **mensagens de erro** (canal **`2`** / `stderr`), usamos `2>`.\nTente listar `/root` (pasta protegida) salvando o erro em `'erros.txt'`.",
    "hint": "**Os 3 canais padrão do Linux:** `0` = entrada (`stdin`), `1` = saída normal (`stdout`), `2` = saída de erro (`stderr`).\nPara desviar só o canal `2` sem espaço entre `2` e `>`: `ls /root 2> erros.txt`",
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
    "description": "Ao rodar `ls /tmp /root`, `/tmp` gera saída normal (canal `1`) e `/root` gera erro de permissão (canal `2`). O operador `&>` junta os dois canais no mesmo arquivo.\nListe `/tmp` e `/root` enviando tudo para `'tudo.log'`.",
    "hint": "`&> arquivo` é o atalho moderno do Bash que equivale a `> arquivo 2>&1` (envia stdout e stderr juntos).\nExecute `ls /tmp /root &> tudo.log` (e confira depois com `cat tudo.log`).",
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
    "description": "O arquivo especial `/dev/null` é o \"buraco negro\" do Linux: tudo que vai para lá é descartado instantaneamente. Muito útil em scripts quando você espera erros e não quer sujar a tela.\nRode `ls /root` descartando as mensagens de erro (`2>`).",
    "hint": "Junte `2>` (canal de erro) apontando para `/dev/null`: `ls /root 2> /dev/null`.",
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
    "description": "Em vez de fazer `echo \"texto\" | comando`, o operador **Here-String (`<<<`)** injeta um texto curto diretamente na entrada padrão (`stdin`) de um comando.\nUse `cat` lendo `'Penguin Gym'` via `<<<`.",
    "hint": "`<<<` funciona como uma versão de 1 linha do here-doc (`<<`): alimenta o `stdin` do comando à esquerda.\nExecute `cat <<< \"Penguin Gym\"`",
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
    "description": "Comandos dentro de parênteses `( ... )` rodam em uma **subshell** (um processo filho temporário). Se você der `cd` lá dentro, ao terminar você continua na sua pasta original!\nEntre em `/tmp` e exiba `pwd` dentro de uma subshell isolada.",
    "hint": "Agrupe os comandos entre parênteses `( ... )` ligados por `&&`: `(cd /tmp && pwd)` (depois rode `pwd` fora e veja que você ainda está em `/home/user`!).",
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
    "description": "Ao contrário de `cd`, o `pushd` funciona como um marcador de página: ele entra na nova pasta e **salva sua pasta anterior numa pilha** para voltar depois sem redigitar o caminho.\nNavegue até `/etc` usando `pushd`.",
    "hint": "Pense em *push directory*: salva o diretório atual na pilha e vai para `/etc` → `pushd /etc`.",
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
    "description": "O par de `pushd` é `popd` (*pop directory*): ele retira o último caminho salvo da pilha e retorna imediatamente para lá.\nVá para `/etc` com `pushd /etc` e depois volte com `popd`.",
    "hint": "Use `&&` para ir com `pushd /etc` e retornar imediatamente para a pasta de origem com `popd`: `pushd /etc && popd`.",
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
    "description": "Quando você edita o `~/.bashrc` para adicionar um alias ou variável, rodar `bash ~/.bashrc` cria um subshell e as mudanças somem! O comando `source` (ou `.`) executa **neste terminal mesmo**.\nRecarregue `~/.bashrc` na sessão atual.",
    "hint": "`source` lê e aplica cada linha direto na sessão aberta (muito usado após editar variáveis ou aliases): `source ~/.bashrc` (ou a forma curta `. ~/.bashrc`).",
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
    "description": "Um script `.sh` pode ser rodado passando-o diretamente como argumento para o interpretador `bash` (sem precisar esperar `chmod +x`).\nExecute o arquivo `'script.sh'` passando-o ao comando `bash`.",
    "hint": "Use `bash <arquivo>` quando quiser que o interpretador Bash leia e execute o script: `bash script.sh` (ou `./script.sh` se já tiver `+x`).",
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
    "description": "Ao baixar ou criar `script.sh`, ele vem sem permissão de execução (`x`), dando *\"Permissão negada\"* ao tentar `./script.sh`. O comando `chmod +x` libera a execução.\nAdicione `+x` em `script.sh` e rode com `./script.sh`.",
    "hint": "**Dois passos clássicos:**\n1. Liberar permissão de execução: `chmod +x script.sh`\n2. Rodar apontando `./` (pasta atual): `./script.sh`\nNa mesma linha: `chmod +x script.sh && ./script.sh`",
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
    "description": "Scripts recebem parâmetros da linha de comando nas variáveis `$1` (1º argumento), `$2` (2º argumento), etc. O arquivo `saudacao.sh` já usa `$1` internamente.\nExecute `saudacao.sh` passando `Penguin` como 1º argumento.",
    "hint": "Escreva o parâmetro logo depois do nome do script, separado por espaço: `bash saudacao.sh Penguin` (aqui `$1` recebe `\"Penguin\"`).",
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
    "description": "**Substituição de comando `$(...)`** executa o comando lá dentro e cola a saída como texto — essencial para montar mensagens dinâmicas e variáveis em automações.\nUse `echo` com `$(uname)` para imprimir `\"Kernel: Linux\"` dinamicamente.",
    "hint": "Aspas duplas `\"...\"` ainda permitem que `$(...)` seja executado pelo Bash (enquanto aspas simples `'...'` travam como texto literal!):\n`echo \"Kernel: $(uname)\"`",
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
    "description": "Diferente de `&&` (que roda o 2º comando só no **sucesso**), o operador **`||`** (*OU*) roda o comando da direita **apenas se o da esquerda falhar**.\nTente ler `inexistente.txt` com `cat` e, se falhar, imprima `\"Arquivo ausente\"` usando `||`.",
    "hint": "Lê-se literalmente: *\"faça isso OU, se der erro, faça aquilo\"*.\nExecute `cat inexistente.txt || echo \"Arquivo ausente\"`",
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
    "description": "A estrutura `for VAR in LISTA; do COMANDO; done` repete um bloco trocando `VAR` por cada item da lista.\nCrie `'log_1.txt'`, `'log_2.txt'` e `'log_3.txt'` de uma vez usando um laço `for`.",
    "hint": "**Anatomia do `for` em uma linha:**\n• `for i in 1 2 3;` → define os valores de `i`\n• `do touch \"log_$i.txt\";` → executa para cada valor (`$i` lê a variável)\n• `done` → fecha o laço\nExecute `for i in 1 2 3; do touch \"log_$i.txt\"; done`",
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
    "description": "Em Bash, `if [ -f caminho ]; then ...; fi` verifica se o caminho existe e é um arquivo comum (`-f`). **Regra crítica:** `[` e `]` exigem espaços em volta deles!\nVerifique se `'documents/readme.txt'` existe e imprima `\"Existe\"` se for verdadeiro.",
    "hint": "**Pegadinha clássica:** `[ -f arquivo ]` PRECISA de espaço depois de `[` e antes de `]`, porque `[` é um comando! E `fi` (if ao contrário) fecha o bloco.\nExecute `if [ -f documents/readme.txt ]; then echo \"Existe\"; fi`",
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
    "description": "Um arquivo `.db` guarda várias **tabelas** (como abas de uma planilha). No SQLite, comandos que começam com ponto (`.`) inspecionam a estrutura do banco e não precisam de `;` no final.\nConsulte quais tabelas existem dentro de `gym.db` usando `.tables`.",
    "hint": "**Como rodar comandos no SQLite pelo terminal:**\n• Formato: `sqlite3 <arquivo_do_banco> <comando>`.\n• `.tables` equivale ao `ls` das pastas — ele apenas lista o nome das tabelas do banco.\n• Você também pode digitar `sqlite3 gym.db` para abrir o prompt interativo `sqlite>` e depois digitar `.tables`!\nExecute `sqlite3 gym.db .tables`",
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
    "title": "Inspecionar colunas e tipos de uma tabela (.schema)",
    "description": "Antes de consultar ou filtrar dados, você precisa saber o **nome exato das colunas** e o tipo de dado (`INTEGER` = número inteiro, `TEXT` = texto).\nVeja a estrutura da tabela `members` no banco `gym.db` usando `.schema`.",
    "hint": "**Por que colocar aspas ao redor de `\".schema members\"`?**\nPorque há um espaço no meio! Sem aspas, o terminal tentaria passar `members` separado do `.schema`.\n• Dica extra: o Painel **🗄️ Banco SQL** à direita também mostra todas as tabelas visualmente.\nExecute `sqlite3 gym.db \".schema members\"`",
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
    "id": "db-select-all",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Primeira consulta SQL: ver todos os registros (SELECT *)",
    "description": "Toda consulta de leitura em SQL segue a base **`SELECT <colunas> FROM <tabela>;`**. O asterisco `*` significa *\"todas as colunas\"* e comandos SQL terminam com ponto e vírgula (`;`).\nExiba todas as colunas e linhas da tabela `members` em `gym.db`.",
    "hint": "**Anatomia da sua 1ª query SQL:**\n• `SELECT *`: traga todas as colunas (`id`, `name`, `email`, `city`, `age`).\n• `FROM members`: da tabela `members`.\n• **No terminal:** envolva o SQL inteiro em aspas duplas `\"...\"` para o Bash entregar tudo junto ao `sqlite3`.\nExecute `sqlite3 gym.db \"SELECT * FROM members;\"`",
    "answer": "sqlite3 gym.db \"SELECT * FROM members;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT * FROM members;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "cat"
    ]
  },
  {
    "id": "db-select-columns",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Escolher apenas colunas específicas no SELECT",
    "description": "Em bancos reais com dezenas de colunas, `SELECT *` traz dados demais. Para buscar só o que interessa, trocamos o `*` pelos nomes das colunas separados por vírgula.\nConsulte apenas `name` e `city` de todos os alunos da tabela `members` em `gym.db`.",
    "hint": "**Regra da vírgula:**\nListe exatamente as colunas desejadas após `SELECT`, separadas por vírgula (sem vírgula antes do `FROM`!).\nExecute `sqlite3 gym.db \"SELECT name, city FROM members;\"`",
    "answer": "sqlite3 gym.db \"SELECT name, city FROM members;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, city FROM members;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "cut"
    ]
  },
  {
    "id": "db-select-distinct",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Remover resultados repetidos com DISTINCT",
    "description": "Se você rodar `SELECT city FROM members;`, a cidade `Tokyo` aparece 4 vezes e `Osaka` 3 vezes. Para ver apenas **valores únicos** (equivalente ao `sort -u`), colocamos `DISTINCT` logo após `SELECT`.\nListe todas as cidades distintas da tabela `members` em `gym.db`.",
    "hint": "**Onde vai o `DISTINCT`?**\nEle vem sempre **entre `SELECT` e o nome da coluna**: `SELECT DISTINCT coluna FROM tabela;`.\nExecute `sqlite3 gym.db \"SELECT DISTINCT city FROM members;\"`",
    "answer": "sqlite3 gym.db \"SELECT DISTINCT city FROM members;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT DISTINCT city FROM members;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "uniq",
      "sort"
    ]
  },
  {
    "id": "db-select-where",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Filtrar linhas de texto com WHERE",
    "description": "A cláusula **`WHERE`** funciona como um filtro (`grep`): ela escolhe apenas as linhas que satisfazem uma condição. Em SQL, valores de texto ficam sempre entre **aspas simples `'...'`**.\nConsulte em `gym.db` apenas o `name` dos membros que moram em `'Tokyo'`.",
    "hint": "**Atenção às aspas dentro de aspas:**\n• Por fora: aspas **duplas** `\"...\"` para o terminal Bash.\n• Por dentro: aspas **simples** `'Tokyo'` para dizer ao SQL que é um texto (diferenciando maiúsculas de minúsculas!).\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\"`",
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
    "id": "db-where-numeric",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Filtrar números com operadores (<, >, !=)",
    "description": "Ao contrário de textos (`'Tokyo'`), **números NÃO usam aspas** no SQL e aceitam comparações matemáticas como `=`, `!=`, `<`, `>`, `<=` e `>=`.\nMostre `name` e `age` dos membros de `gym.db` que têm **menos de 21 anos** (`age < 21`).",
    "hint": "**Comparando números no `WHERE`:**\n• Como `age` é `INTEGER` (número), escrevemos direto `age < 21` (sem aspas!).\n• Para trazer mais de uma coluna, separe com vírgula no `SELECT`: `SELECT name, age`.\nExecute `sqlite3 gym.db \"SELECT name, age FROM members WHERE age < 21;\"`",
    "answer": "sqlite3 gym.db \"SELECT name, age FROM members WHERE age < 21;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, age FROM members WHERE age < 21;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-boundary",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Cuidado com o limite: >= vs >",
    "description": "Um bug super comum é errar o limite de corte: `WHERE age > 20` deixa de fora quem tem exatamente `20` anos (como Momo e Sora!). Quando queremos **\"20 ou mais\"**, usamos **`>=`**.\nConte quantos membros têm **20 anos ou mais** em `gym.db` usando `COUNT(*)`.",
    "hint": "**Diferença entre `>` e `>=`:**\n• `age > 20` → começa no `21` (`20` fica de fora).\n• `age >= 20` → **inclui** quem tem `20`!\n• Use `SELECT COUNT(*) FROM members WHERE ...;` para contar em vez de listar nomes.\nExecute `sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\"`",
    "answer": "sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT COUNT(*) FROM members WHERE age >= 20;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-where-and",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Combinar duas condições obrigatórias com AND",
    "description": "Quando um filtro exige que **dois critérios sejam verdadeiros ao mesmo tempo**, ligamos os dois testes no `WHERE` com **`AND`** (*E*).\nMostre o `name` dos membros de `gym.db` que moram em `'Tokyo'` **E** têm `age >= 25`.",
    "hint": "**Como ler o `AND`:**\nA linha só aparece no resultado se a 1ª condição (`city = 'Tokyo'`) **E** a 2ª (`age >= 25`) forem verdadeiras.\n• Não precisa repetir `WHERE`: escreva `WHERE cond1 AND cond2;`.\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo' AND age >= 25;\"`",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo' AND age >= 25;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE city = 'Tokyo' AND age >= 25;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-where-or",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Iniciante",
    "lpicObjective": null,
    "title": "Aceitar uma condição ou outra com OR",
    "description": "**Pegadinha clássica:** se você escrever `city = 'Lisboa' AND city = 'Porto'`, vai dar **0 resultados** porque ninguém mora nas duas cidades na mesma linha! Para aceitar *uma opção OU outra*, usamos **`OR`**.\nMostre `name` e `city` dos membros de `'Lisboa'` ou `'Porto'` em `gym.db`.",
    "hint": "**Pegadinha importante do `OR`:**\nSempre repita o nome da coluna depois do `OR`! Escrever `city = 'Lisboa' OR 'Porto'` **não** funciona — precisa ser `city = 'Lisboa' OR city = 'Porto'`.\nExecute `sqlite3 gym.db \"SELECT name, city FROM members WHERE city = 'Lisboa' OR city = 'Porto';\"`",
    "answer": "sqlite3 gym.db \"SELECT name, city FROM members WHERE city = 'Lisboa' OR city = 'Porto';\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, city FROM members WHERE city = 'Lisboa' OR city = 'Porto';\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-where-in",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Substituir vários OR por uma lista limpa com IN (...)",
    "description": "Escrever `city = 'A' OR city = 'B' OR city = 'C'` cansa rápido! O operador **`IN ('A', 'B', 'C')`** deixa a consulta muito mais curta e fácil de ler.\nMostre o `name` dos membros de `gym.db` cuja cidade está na lista `'Tokyo'`, `'Osaka'` ou `'Porto'` usando `IN`.",
    "hint": "**Sintaxe limpa do `IN`:**\n`WHERE coluna IN ('valor1', 'valor2', 'valor3')` — funciona exatamente como vários `OR`, mas sem repetir `city =`!\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE city IN ('Tokyo', 'Osaka', 'Porto');\"`",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE city IN ('Tokyo', 'Osaka', 'Porto');\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE city IN ('Tokyo', 'Osaka', 'Porto');\""
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
    "description": "Em vez de escrever `age >= 20 AND age <= 30`, o SQL tem um atalho muito mais legível: **`BETWEEN 20 AND 30`** (que **inclui** os valores `20` e `30` das pontas).\nEm `gym.db`, selecione `name` e `age` dos membros entre `20` e `30` anos usando `BETWEEN`.",
    "hint": "**Atenção:** `BETWEEN A AND B` sempre inclui `A` e `B` (ou seja, `20` e `30` entram na conta!).\nExecute `sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\"`",
    "answer": "sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, age FROM members WHERE age BETWEEN 20 AND 30;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-like-search",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Buscar por trecho de texto com LIKE e %",
    "description": "Enquanto `=` exige o texto exato inteiro, o **`LIKE`** permite buscar por parte do texto! Em SQL, o símbolo curinga para *\"qualquer sequência de caracteres\"* é **`%`** (diferente do `*` do terminal Linux).\nConsulte em `gym.db` o `name` dos membros cujo `email` termina com `'@example.com'`.",
    "hint": "**Como usar `%` no `LIKE`:**\n• `'%@example.com'` → qualquer coisa no começo, **terminando** em `@example.com`.\n• `'A%'` → **começa** com `A`.\n• `'%ana%'` → **contém** `ana` em qualquer lugar.\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\"`",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE email LIKE '%@example.com';\""
    ],
    "relatedCommands": [
      "sqlite3",
      "grep"
    ]
  },
  {
    "id": "db-null",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Encontrar valores ausentes com IS NULL",
    "description": "Em bancos de dados, campo vazio desconhecido se chama **`NULL`**. Se você testar `WHERE email = NULL;`, vai dar **0 linhas** porque `NULL` significa *\"desconhecido\"* — e não se compara com `=`!\nMostre o `name` dos membros de `gym.db` sem e-mail usando **`IS NULL`**.",
    "hint": "**Regra de ouro do `NULL`:**\nNunca use `= NULL` nem `!= NULL`. Para checar ausência de valor usamos sempre **`IS NULL`** (equivalente a `grep -v @ members.csv` no Linux).\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE email IS NULL;\"`",
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
    "id": "db-is-not-null",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Filtrar apenas campos preenchidos com IS NOT NULL",
    "description": "E quando queremos o oposto — excluir registros sem e-mail e pegar **somente quem tem e-mail preenchido**? Basta negar com **`IS NOT NULL`** (nunca `!= NULL`)!\nMostre o `name` dos membros de `gym.db` que possuem `email` cadastrado.",
    "hint": "Troque `IS NULL` por **`IS NOT NULL`** para manter apenas linhas em que a coluna `email` não está vazia.\nExecute `sqlite3 gym.db \"SELECT name FROM members WHERE email IS NOT NULL;\"`",
    "answer": "sqlite3 gym.db \"SELECT name FROM members WHERE email IS NOT NULL;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name FROM members WHERE email IS NOT NULL;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-order-simple",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ordenar resultados com ORDER BY",
    "description": "Sem ordenação explícita, linhas saem na ordem em que foram gravadas. A cláusula **`ORDER BY`** ordena o resultado: por padrão do **menor para o maior (`ASC`)**, ou do maior para o menor (`DESC`).\nEm `gym.db`, liste `name` e `age` de todos os membros ordenados do **mais jovem para o mais velho**.",
    "hint": "**Como funciona o `ORDER BY`:**\n• Vai **depois** do `FROM` (e depois do `WHERE`, se houver filtro).\n• `ORDER BY age ASC` (ou apenas `ORDER BY age`) ordena em ordem crescente (`18` até `45`).\nExecute `sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age ASC;\"`",
    "answer": "sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age ASC;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age ASC;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "sort"
    ]
  },
  {
    "id": "db-limit-simple",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Limitar quantidade de linhas com LIMIT",
    "description": "Em tabelas grandes, pedir todas as linhas pode travar a tela — o **`LIMIT`** corta o resultado após *N* linhas (igual ao `head -n` no Linux!).\nExiba `id` e `name` apenas dos **3 primeiros** registros de `members` em `gym.db`.",
    "hint": "**Posição do `LIMIT`:** ele fica sempre bem no **final** da consulta (`SELECT ... FROM ... LIMIT 3;`).\nExecute `sqlite3 gym.db \"SELECT id, name FROM members LIMIT 3;\"`",
    "answer": "sqlite3 gym.db \"SELECT id, name FROM members LIMIT 3;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT id, name FROM members LIMIT 3;\""
    ],
    "relatedCommands": [
      "sqlite3",
      "head"
    ]
  },
  {
    "id": "db-order-limit",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Ranking Top 3 combinando ORDER BY DESC e LIMIT",
    "description": "Agora juntamos os dois! Para montar um ranking (*Top 3*), primeiro ordenamos do maior para o menor com **`ORDER BY coluna DESC`** e só depois cortamos com **`LIMIT 3`**.\nMostre `name` e `age` dos **3 membros mais velhos** de `gym.db` (em caso de empate na idade, ordene por `name`).",
    "hint": "**Múltiplas colunas no `ORDER BY`:**\nSepare os critérios por vírgula: primeiro `age DESC` (maior primeiro), depois `name` (empates em ordem alfabética), e `LIMIT 3` no fim.\n*(Equivalente no Linux: `sort -t, -k5 -rn | head -3`.)*\nExecute `sqlite3 gym.db \"SELECT name, age FROM members ORDER BY age DESC, name LIMIT 3;\"`",
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
    "id": "db-count",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Contar registros com a função COUNT(*)",
    "description": "As **funções de agregação** resumem várias linhas em um único número! A mais famosa é `COUNT(*)`, que conta quantas linhas existem na consulta (como `wc -l`, mas sem contar linha de cabeçalho).\nConte o total de registros da tabela `members` em `gym.db`.",
    "hint": "• `COUNT(*)` vai no lugar das colunas após `SELECT`: `SELECT COUNT(*) FROM members;`.\n• Dica extra: no CSV (`wc -l members.csv`), vem `13` porque a 1ª linha é o cabeçalho; no SQL retorna exatamente `12` alunos!\nExecute `sqlite3 gym.db \"SELECT COUNT(*) FROM members;\"`",
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
    "id": "db-min-max-as",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Calcular mínimo, máximo e dar apelidos (MIN, MAX, AS)",
    "description": "Além de `COUNT`, podemos achar o menor valor com **`MIN(col)`** e o maior com **`MAX(col)`**, e renomear o resultado usando **`AS apelido`** (*alias*) para deixar relatórios legíveis.\nEm `gym.db`, consulte na mesma query `MIN(age) AS menor_idade` e `MAX(age) AS maior_idade` de `members`.",
    "hint": "**Como dar apelido a uma coluna/função:**\nEscreva `expressao AS nome_bonito` no `SELECT` (ex.: `MIN(age) AS menor_idade, MAX(age) AS maior_idade`).\nExecute `sqlite3 gym.db \"SELECT MIN(age) AS menor_idade, MAX(age) AS maior_idade FROM members;\"`",
    "answer": "sqlite3 gym.db \"SELECT MIN(age) AS menor_idade, MAX(age) AS maior_idade FROM members;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT MIN(age) AS menor_idade, MAX(age) AS maior_idade FROM members;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-sum-avg",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Calcular média numérica com AVG()",
    "description": "Assim como `SUM(col)` soma uma coluna, **`AVG(col)`** (*average*) calcula a média aritmética ignorando valores `NULL`.\nA partir desta trilha temos também o banco **`gym_legacy.db`** (com tabelas `members`, `plans` e `enrollments`). Nele, calcule a média do preço mensal (`monthly_fee`) da tabela `plans`.",
    "hint": "**Atenção ao arquivo do banco!** Aqui o banco é **`gym_legacy.db`** (não `gym.db`), e a tabela é `plans`.\n• Para arredondar casas decimais também é possível envolver com `ROUND(AVG(monthly_fee), 2)`.\nExecute `sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\"`",
    "answer": "sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT AVG(monthly_fee) FROM plans;\""
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
    "title": "Agrupar e contar por categoria com GROUP BY",
    "description": "`COUNT(*)` sozinho conta a tabela inteira; mas se quisermos **um total separado para cada cidade**, usamos **`GROUP BY city`** (que cria uma \"caixinha\" por cidade e aplica `COUNT(*)` dentro de cada uma!).\nEm `gym.db`, conte quantos membros existem em cada `city` usando `GROUP BY`.",
    "hint": "**Regra de ouro do `GROUP BY`:**\nToda coluna solta no `SELECT` que **não** está dentro de `COUNT/SUM/AVG` precisa aparecer no `GROUP BY`!\n*(No Linux, equivale a `cut -d , -f 4 members.csv | sort | uniq -c` — só que sem contar o cabeçalho!)*\nExecute `sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city;\"`",
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
    "id": "db-having",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Intermediário",
    "lpicObjective": null,
    "title": "Filtrar grupos já contados com HAVING",
    "description": "**Dúvida clássica de SQL:** por que `WHERE COUNT(*) > 2` dá erro? Porque `WHERE` filtra **linhas antes** de agrupar; para filtrar **grupos depois** do `GROUP BY` (ex.: cidades com mais de 2 alunos), usamos **`HAVING`**!\nEm `gym.db`, agrupe por `city` e exiba somente as cidades com `COUNT(*) > 2`.",
    "hint": "**Ordem mental fixa do SQL:**\n`WHERE` (filtra linhas) → `GROUP BY` (agrupa) → **`HAVING`** (filtra os grupos já agregados!).\nExecute `sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\"`",
    "answer": "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\"",
    "answerSteps": [
      "sqlite3 gym.db \"SELECT city, COUNT(*) FROM members GROUP BY city HAVING COUNT(*) > 2;\""
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
    "title": "Integrar SQLite com pipes do Linux (-csv | sort | uniq -c)",
    "description": "Na prática de automação, o `sqlite3` conversa direto com comandos do terminal via `|` (*pipe*)! A flag **`-csv`** faz o banco imprimir valores limpos fáceis de processar no shell.\nExporte `city` de `members` (`gym.db`) com `sqlite3 -csv` e conte ocorrências usando `| sort | uniq -c`.",
    "hint": "• Lembre que `uniq -c` só agrupa linhas iguais quando elas estão **vizinhas** — por isso `sort` vem antes de `uniq -c`!\n• Compare o resultado com o `GROUP BY city` anterior: as contagens batem!\nExecute `sqlite3 -csv gym.db \"SELECT city FROM members\" | sort | uniq -c`",
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
    "title": "Criar uma nova tabela no SQLite (CREATE TABLE)",
    "description": "Até aqui só **lemos** dados (`SELECT`). Agora vamos construir estrutura! **`CREATE TABLE nome (col1 TIPO, col2 TIPO);`** cria uma nova tabela vazia no banco.\nEm `gym.db`, crie a tabela `workouts` com as colunas `id INTEGER PRIMARY KEY` e `title TEXT` (veja aparecer no **Painel SQL** à direita!).",
    "hint": "**Tipos básicos no SQLite:** `INTEGER` (números inteiros), `TEXT` (textos), `PRIMARY KEY` (identificador único automático da linha).\nExecute `sqlite3 gym.db \"CREATE TABLE workouts (id INTEGER PRIMARY KEY, title TEXT);\"`",
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
    "title": "Inserir novo registro na tabela (INSERT INTO)",
    "description": "Para gravar uma nova linha usamos **`INSERT INTO tabela (colunas) VALUES (valores);`**, mantendo exatamente a mesma ordem entre colunas e valores (textos entre `'...'`, números sem aspas).\nMatricule `'Tux'` (`id` `13`, `email` `'tux@example.com'`, `city` `'Tokyo'`, `age` `25`) em `members` de `gym.db`.",
    "hint": "**Cuidado na correspondência 1-para-1:** cada coluna listada em `(id, name, email, city, age)` deve bater em posição e tipo com `(13, 'Tux', 'tux@example.com', 'Tokyo', 25)`.\nExecute `sqlite3 gym.db \"INSERT INTO members (id, name, email, city, age) VALUES (13, 'Tux', 'tux@example.com', 'Tokyo', 25);\"`",
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
    "title": "Atualizar registro específico com UPDATE ... WHERE",
    "description": "Um dos erros mais temidos em produção é rodar `UPDATE tabela SET ...` **sem `WHERE`** — isso altera **todas as linhas** da tabela inteira! Sempre filtre pela chave única (`WHERE id = 3`).\nNo banco **`gym_legacy.db`**, altere apenas a `city` do aluno de `id = 3` para `'Osaka'`.",
    "hint": "**Hábito de ouro antes de alterar dados:** confira antes qual linha vai mudar com `SELECT`!\n1. Confira: `sqlite3 gym_legacy.db \"SELECT * FROM members WHERE id = 3;\"`\n2. Atualize só ela: `sqlite3 gym_legacy.db \"UPDATE members SET city = 'Osaka' WHERE id = 3;\"`",
    "answer": "sqlite3 gym_legacy.db \"UPDATE members SET city = 'Osaka' WHERE id = 3;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT * FROM members WHERE id = 3;\"",
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
    "title": "Excluir registro específico com DELETE FROM ... WHERE",
    "description": "Mesma regra de segurança do `UPDATE`: **`DELETE FROM tabela` sem `WHERE` apaga a tabela inteira!** Por isso sempre filtramos pelo `id` exato.\nNo banco **`gym_legacy.db`**, remova exclusivamente o membro de `id = 10` (`Leo`) da tabela `members`.",
    "hint": "Use `WHERE id = 10` para garantir que apenas 1 linha seja removida:\n`sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\"`",
    "answer": "sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"DELETE FROM members WHERE id = 10;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-join-simple",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "Seu primeiro JOIN: ligar duas tabelas (enrollments + plans)",
    "description": "Em bancos relacionais não repetimos o nome do plano em cada matrícula: a tabela `enrollments` guarda só o número `plan_id`. O **`JOIN ... ON`** conecta duas tabelas cruzando a chave estrangeira (`e.plan_id = p.id`).\nEm **`gym_legacy.db`**, junte `enrollments` (`e`) com `plans` (`p`) para listar `e.member_id` e `p.name` de todas as matrículas.",
    "hint": "**Como ler um `JOIN` de 2 tabelas passo a passo:**\n• `FROM enrollments e`: tabela principal com apelido curto `e`.\n• `JOIN plans p`: tabela que queremos trazer junto (apelido `p`).\n• `ON p.id = e.plan_id`: a \"ponte\" dizendo quais linhas combinam!\nExecute `sqlite3 gym_legacy.db \"SELECT e.member_id, p.name FROM enrollments e JOIN plans p ON p.id = e.plan_id;\"`",
    "answer": "sqlite3 gym_legacy.db \"SELECT e.member_id, p.name FROM enrollments e JOIN plans p ON p.id = e.plan_id;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT e.member_id, p.name FROM enrollments e JOIN plans p ON p.id = e.plan_id;\""
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
    "title": "Encadear múltiplos JOINs e filtrar plano ativo",
    "description": "Agora conectamos **3 tabelas** para ir do aluno até o plano! Em `gym_legacy.db`, `enrollments` guarda o histórico inteiro de matrículas — apenas o plano **atual** ainda não acabou (`ended_at IS NULL`).\nMostre o `name` de cada membro (`m.name`) e o nome do plano atual (`p.name`) usando dois `JOIN`s e `WHERE e.ended_at IS NULL`.",
    "hint": "**Encadeando duas pontes (`members` → `enrollments` → `plans`):**\n• 1º `JOIN enrollments e ON e.member_id = m.id` liga aluno à matrícula.\n• 2º `JOIN plans p ON p.id = e.plan_id` liga matrícula ao nome do plano.\n• `WHERE e.ended_at IS NULL` evita repetir planos antigos encerrados!\nExecute `sqlite3 gym_legacy.db \"SELECT m.name, p.name FROM members m JOIN enrollments e ON e.member_id = m.id JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL;\"`",
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
    "title": "Encontrar quem ficou sem par com LEFT JOIN",
    "description": "O `JOIN` normal esconde quem não tem matrícula! Já o **`LEFT JOIN`** mantém **todos** da tabela da esquerda (`members`), preenchendo com `NULL` as colunas de quem não tem par em `enrollments`.\nEm `gym_legacy.db`, mostre o `name` dos membros que **nunca se inscreveram** (`WHERE e.id IS NULL`).",
    "hint": "**Truque clássico de entrevista (`LEFT JOIN` + `IS NULL`):**\n1. `FROM members m LEFT JOIN enrollments e ON e.member_id = m.id` traz os 9 alunos (quem nunca se inscreveu vem com `e.id = NULL`).\n2. Filtrar `WHERE e.id IS NULL` isola só quem nunca teve matrícula! (`NOT IN` ou `NOT EXISTS` também funcionam.)\nExecute `sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\"`",
    "answer": "sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT m.name FROM members m LEFT JOIN enrollments e ON e.member_id = m.id WHERE e.id IS NULL;\""
    ],
    "relatedCommands": [
      "sqlite3"
    ]
  },
  {
    "id": "db-boss-report",
    "category": "database",
    "categoryLabel": "SQL",
    "difficulty": "Avançado",
    "lpicObjective": null,
    "title": "🏆 Projeto Final SQL: Receita mensal por plano ativo",
    "description": "Combine quase tudo que você aprendeu em um relatório gerencial real! No `gym_legacy.db`, junte `enrollments` (`e`) e `plans` (`p`), considere apenas matrículas ativas (`WHERE e.ended_at IS NULL`), agrupe por plano (`GROUP BY p.name`) e mostre **nome do plano**, **total de ativos (`COUNT(*)`)** e **receita mensal (`SUM(p.monthly_fee)`)**, ordenando da maior receita para a menor (`ORDER BY ... DESC`).",
    "hint": "**Quebre a query na ordem exata de leitura:**\n1. `SELECT p.name, COUNT(*) AS ativos, SUM(p.monthly_fee) AS total`\n2. `FROM enrollments e JOIN plans p ON p.id = e.plan_id`\n3. `WHERE e.ended_at IS NULL`\n4. `GROUP BY p.name`\n5. `ORDER BY total DESC;`\n```sql\nsqlite3 gym_legacy.db \"SELECT p.name, COUNT(*) AS ativos, SUM(p.monthly_fee) AS total FROM enrollments e JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL GROUP BY p.name ORDER BY total DESC;\"\n```",
    "answer": "sqlite3 gym_legacy.db \"SELECT p.name, COUNT(*) AS ativos, SUM(p.monthly_fee) AS total FROM enrollments e JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL GROUP BY p.name ORDER BY total DESC;\"",
    "answerSteps": [
      "sqlite3 gym_legacy.db \"SELECT p.name, COUNT(*) AS ativos, SUM(p.monthly_fee) AS total FROM enrollments e JOIN plans p ON p.id = e.plan_id WHERE e.ended_at IS NULL GROUP BY p.name ORDER BY total DESC;\""
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
    "description": "Um script Bash é só um arquivo de texto com comandos em sequência. Na 1ª linha colocamos `#!/bin/bash` (**shebang**) para avisar ao Linux qual programa deve ler o arquivo.\nCrie `organiza.sh` com `#!/bin/bash` e `echo \"Iniciando automacao...\"`, dê permissão de execução com `chmod +x` e rode com `./organiza.sh`.",
    "hint": "**Por que 3 passos?**\n1. **Criar o arquivo:** abra com `nano organiza.sh` ou gere direto pelo terminal com **here-doc** (`cat << 'EOF' > ...` grava tudo até encontrar a palavra `EOF`).\n2. **Dar permissão (`chmod +x`):** por padrão, arquivos novos não podem rodar como programas; `+x` ativa essa permissão.\n3. **Usar `./` ao executar:** por segurança, o Linux não roda scripts da pasta atual pelo nome solto — `./` significa *\"nesta pasta aqui\"*.\n```bash\ncat << 'EOF' > organiza.sh\n#!/bin/bash\necho \"Iniciando automacao...\"\nEOF\nchmod +x organiza.sh\n./organiza.sh\n```",
    "answer": "cat << 'EOF' > organiza.sh\n#!/bin/bash\necho \"Iniciando automacao...\"\nEOF\nchmod +x organiza.sh && ./organiza.sh",
    "answerSteps": [
      "cat << 'EOF' > organiza.sh\n#!/bin/bash\necho \"Iniciando automacao...\"\nEOF",
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
    "description": "Em scripts diários, colocar a data no nome do arquivo evita apagar o log de ontem. O formato `$(comando)` (**substituição de comando**) roda o comando interno primeiro e cola o texto resultante no lugar.\nCrie a pasta `~/logs` (usando `-p` para não falhar se já existir) e gere dentro dela `relatorio_<DATA>.log` usando `$(date +%Y-%m-%d)`.",
    "hint": "**Entendendo cada pedaço:**\n• Teste antes no terminal: `date +%Y-%m-%d` imprime a data de hoje (ex.: `2026-11-18`, onde `%Y`=ano, `%m`=mês, `%d`=dia).\n• `~` representa sua pasta pessoal (`/home/user`), e `mkdir -p` cria a pasta sem reclamar se ela já existir.\n• Ao escrever `relatorio_$(date +%Y-%m-%d).log`, o Bash troca o bloco `$(...)` pela data automaticamente!\n```bash\nmkdir -p ~/logs\necho \"Status OK\" > ~/logs/relatorio_$(date +%Y-%m-%d).log\n```",
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
    "description": "Quando um script roda em segundo plano, ninguém está olhando a tela. No Linux existem dois canais de texto: o **`1` (`stdout`)** para saídas normais e o **`2` (`stderr`)** para erros.\nJá existe um script `./rotina.sh` na sua pasta. Execute-o acumulando saída normal **e** erros no fim de `automacao.log` (`>> automacao.log 2>&1`).",
    "hint": "**Como ler essa sintaxe sem mistério:**\n• Primeiro rode `./rotina.sh` sozinho para ver o que sai (ele imprime um texto normal e tenta listar `/root`, gerando um erro).\n• `>> automacao.log`: **anexa** (`>>`) a saída normal (canal `1`) ao fim do arquivo, sem apagar logs anteriores.\n• `2>&1`: redireciona o canal **`2`** (erros) para o **mesmo destino atual do canal `1`** (`&1`).\n• **Pegadinha clássica:** `2>&1` tem que vir **depois** de `>> automacao.log`! (O atalho `&>> automacao.log` faz o mesmo.)\n```bash\n./rotina.sh >> automacao.log 2>&1\ncat automacao.log\n```",
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
    "description": "Um bom script prepara suas pastas antes de mover arquivos. Com **expansão de chaves `{a,b,c}`**, o Bash gera vários caminhos a partir de um prefixo comum em uma linha só.\nCrie `downloads/imagens`, `downloads/documentos` e `downloads/arquivos` em um único comando `mkdir -p`.",
    "hint": "**Como `{...}` funciona na prática:**\nAntes de executar o `mkdir`, o Bash expande `downloads/{imagens,documentos,arquivos}` exatamente para:\n`mkdir -p downloads/imagens downloads/documentos downloads/arquivos`\n• Use `-p` para o script poder rodar novamente amanhã sem falhar com *\"Diretório já existe\"*.\n• **Pegadinha:** **não coloque espaços depois da vírgula** dentro de `{...}`, senão o Bash não expande!",
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
    "description": "A pasta `downloads/` tem arquivos `.pdf`, `.jpg`, `.png` e `.zip` misturados (confira antes com `ls downloads`). O curinga `*` (**globbing**) combina com qualquer texto no nome.\nMova todos os `.pdf` para `downloads/documentos/` e todas as imagens (`.jpg` e `.png`) para `downloads/imagens/`.",
    "hint": "**Regra de ouro do `mv` com vários arquivos:**\nVocê pode passar **várias origens** seguidas e o **último argumento** (terminando em `/`) é a pasta de destino.\n• Passo 1 (PDFs): `mv downloads/*.pdf downloads/documentos/`\n• Passo 2 (Imagens `.jpg` e `.png` juntos): `mv downloads/*.jpg downloads/*.png downloads/imagens/`\n• Use `&&` entre eles se quiser rodar na mesma linha (o 2º só roda se o 1º não der erro).",
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
    "description": "Agora vamos transformar aquela triagem manual em um robô reutilizável! Quando uma pasta não tem nenhum `.pdf`, um `for` simples mantém o padrão literal `*.pdf` e o `mv` falha — por isso testamos `[ -f \"$f\" ]` (*\"esse item existe como arquivo?\"*).\nCrie `organizar_downloads.sh` com laço `for` e `[ -f \"$f\" ]` para mover `.pdf` para `downloads/documentos/` e `.png` para `downloads/imagens/`, dê `+x` e rode `./organizar_downloads.sh`.",
    "hint": "**Anatomia do script (3 regras vitais do Bash):**\n• `for f in lista; do ... done`: percorre cada item guardando na variável `f` (`\"$f\"` com aspas protege nomes com espaço).\n• `[ -f \"$f\" ]`: **espaços logo após `[` e antes de `]` são obrigatórios!** `-f` verifica se é um arquivo real.\n• Monte o arquivo (com `nano` ou `cat << 'EOF'`), dê `chmod +x organizar_downloads.sh` e rode `./organizar_downloads.sh`:\n```bash\n#!/bin/bash\nfor f in downloads/*.pdf; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/documentos/\n  fi\ndone\nfor f in downloads/*.png; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/imagens/\n  fi\ndone\n```",
    "answer": "cat << 'EOF' > organizar_downloads.sh\n#!/bin/bash\nfor f in downloads/*.pdf; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/documentos/\n  fi\ndone\nfor f in downloads/*.png; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/imagens/\n  fi\ndone\nEOF\nchmod +x organizar_downloads.sh && ./organizar_downloads.sh",
    "answerSteps": [
      "cat << 'EOF' > organizar_downloads.sh\n#!/bin/bash\nfor f in downloads/*.pdf; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/documentos/\n  fi\ndone\nfor f in downloads/*.png; do\n  if [ -f \"$f\" ]; then\n    mv \"$f\" downloads/imagens/\n  fi\ndone\nEOF",
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
    "description": "Em scripts de manutenção, sair dando `rm -rf` é receita para desastre. O `find` permite filtrar exatamente o que será apagado — e você pode **listar primeiro antes de apagar**!\nApague apenas arquivos `.tmp` dentro de `downloads/` mantendo `importante.txt` intacto.",
    "hint": "**Boa prática em 2 etapas (teste antes de apagar):**\n1. Primeiro liste o que casa com o filtro: `find downloads -type f -name \"*.tmp\"` (`-type f` garante só arquivos; as aspas em `\"*.tmp\"` entregam o padrão intacto ao `find`).\n2. Confirmou a lista? Adicione `-delete` no final para apagar com segurança:\n`find downloads -type f -name \"*.tmp\" -delete`",
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
    "description": "Diferente do `cp -r` que recopia tudo do zero toda vez, o `rsync` compara os arquivos e transfere apenas o que é novo ou mudou. A barra `/` no fim de `documents/` significa *\"copie os arquivos de dentro da pasta\"*.\nEspelhe `documents/` para `backups/documents/` usando `rsync` com `-a` (*archive*) e `-v` (*verbose*).",
    "hint": "**Decodificando as opções do `rsync`:**\n• `-a` (**archive**): copia subpastas inteiras preservando permissões e datas.\n• `-v` (**verbose**): mostra na tela o nome de cada arquivo transferido.\n• **Atenção à barra `/`:** `documents/` (com `/`) copia o *conteúdo* para `backups/documents/`; sem a barra criaria `backups/documents/documents/`.\n• Comando final: `rsync -av documents/ backups/documents/`",
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
    "description": "A opção `--delete` transforma o `rsync` em um espelho exato, **apagando no destino** arquivos que não existem mais na origem — como `obsoleto.txt` dentro de `backups/documents/`.\nNunca rode `--delete` no escuro! Adicione **`-n`** (`--dry-run`) para **simular** o comando e ver o que seria apagado sem remover nada de verdade.",
    "hint": "**Por que usar `-n` (`--dry-run`) sempre?**\nEle funciona como um modo de ensaio (*DRY RUN*): imprime exatamente `deleting obsoleto.txt`, mas não apaga nem altera nenhum arquivo.\n• Junte `-a` (archive), `-v` (verbose) e `-n` (dry-run): `-avn`, seguido de `--delete`.\n• Comando completo: `rsync -avn --delete documents/ backups/documents/`",
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
    "description": "No Linux, todo comando termina devolvendo um código numérico: **`0` = sucesso**, diferente de `0` = falha. Um script confiável usa **`&&`** (*\"só rode a próxima linha se a anterior deu `0`\"*) antes de anunciar sucesso.\nCrie e execute `backup.sh` compactando `documents` em `backups/docs_backup.tar.gz` (`tar -czf`) e imprimindo `Backup OK` somente se o `tar` der certo.",
    "hint": "**Decifrando `tar -czf` + `&&`:**\n• **`c`** = *create* (criar arquivo `.tar`), **`z`** = comprimir com g**z**ip (`.tar.gz`), **`f`** = *file* (o nome do arquivo de saída vem logo em seguida!).\n• Ordem obrigatória após `-f`: primeiro o **destino** (`backups/docs_backup.tar.gz`), depois a **origem** (`documents`).\n• Depois crie com `nano` ou `cat << 'EOF'`, dê `chmod +x backup.sh` e rode `./backup.sh`:\n```bash\n#!/bin/bash\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\n```",
    "answer": "cat << 'EOF' > backup.sh\n#!/bin/bash\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\nEOF\nchmod +x backup.sh && ./backup.sh",
    "answerSteps": [
      "cat << 'EOF' > backup.sh\n#!/bin/bash\ntar -czf backups/docs_backup.tar.gz documents && echo \"Backup OK\"\nEOF",
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
    "description": "Scripts de monitoramento leem métricas, limpam o texto para extrair só o número e comparam no `if`. Aqui a raiz `/` está com `24%` de uso.\nCrie e execute `checa_disco.sh` extraindo apenas o número `24` (via `df -h /`, `awk` e `tr -d '%'`) e imprimindo `ALERTA: Disco alto` se ele for maior que `20` (`-gt 20`).",
    "hint": "**Monte por partes (teste o passo 1 no terminal antes!):**\n1. Rode `df -h /` e veja a tabela: a **5ª coluna (`$5`)** da linha `/dev/sda1` mostra `24%`.\n2. Extraia e limpe o `%`: `df -h / | awk '/sda1/ {print $5}' | tr -d '%'` → devolve só `24`!\n3. Salve em uma variável **sem espaços no `=`**: `USO=$(...)`.\n4. **Por que `-gt` em vez de `>`?** Dentro de `[ ... ]`, `>` redireciona arquivo! Para comparar **números** no Bash use `-gt` (*greater than*, maior que). (`${USO}` evita grudar o `%` no nome da variável).\n```bash\n#!/bin/bash\nUSO=$(df -h / | awk '/sda1/ {print $5}' | tr -d '%')\nif [ \"$USO\" -gt 20 ]; then\n  echo \"ALERTA: Disco alto (${USO}%)\"\nfi\n```",
    "answer": "cat << 'EOF' > checa_disco.sh\n#!/bin/bash\nUSO=$(df -h / | awk '/sda1/ {print $5}' | tr -d '%')\nif [ \"$USO\" -gt 20 ]; then\n  echo \"ALERTA: Disco alto (${USO}%)\"\nfi\nEOF\nchmod +x checa_disco.sh && ./checa_disco.sh",
    "answerSteps": [
      "cat << 'EOF' > checa_disco.sh\n#!/bin/bash\nUSO=$(df -h / | awk '/sda1/ {print $5}' | tr -d '%')\nif [ \"$USO\" -gt 20 ]; then\n  echo \"ALERTA: Disco alto (${USO}%)\"\nfi\nEOF",
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
    "description": "O serviço `nginx` caiu! Scripts *watchdog* checam silenciosamente se ele está no ar com `systemctl is-active --quiet nginx` (retorna `0` se ativo ou erro `!= 0` se parado) e o reiniciam caso contrário.\nCrie `watchdog.sh`, torne executável e rode `./watchdog.sh` para religar o `nginx`.",
    "hint": "**Dúvida comum de júnior: por que aqui NÃO usamos `[ ... ]` no `if`?**\n• No Bash, `if` sempre testa o **código de saída** de um comando! Para comparar variáveis usamos `[ ... ]`, mas `systemctl is-active --quiet nginx` já devolve `0` (ativo) ou erro (parado) — então passamos ele **direto** no `if`!\n• O `!` inverte o resultado (*\"se **NÃO** estiver ativo, inicie com `sudo`\"*). Outra forma curta válida é `cmd1 || cmd2` (*\"rode a direita só se a esquerda falhar\"*).\n```bash\n#!/bin/bash\nif ! systemctl is-active --quiet nginx; then\n  sudo systemctl start nginx\nfi\n```",
    "answer": "cat << 'EOF' > watchdog.sh\n#!/bin/bash\nif ! systemctl is-active --quiet nginx; then\n  sudo systemctl start nginx\nfi\nEOF\nchmod +x watchdog.sh && ./watchdog.sh",
    "answerSteps": [
      "cat << 'EOF' > watchdog.sh\n#!/bin/bash\nif ! systemctl is-active --quiet nginx; then\n  sudo systemctl start nginx\nfi\nEOF",
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
    "description": "Um script só vira automação de verdade quando roda sozinho no horário programado! O `cron` recebe 5 campos de horário antes do comando — **atenção: `minuto` vem ANTES da `hora`** — e caminhos completos (`/home/user/...`).\nAgende `/home/user/organizar_downloads.sh` para todo dia às **02:30** (`30 2 * * *`), gravando logs em `/home/user/cron.log` (`>> ... 2>&1`).",
    "hint": "**Mapa dos 5 campos do cron (`*` = todos):**\n```bash\n# min  hora  dia_mês  mês  dia_semana  comando\n  30    2       *      *       *       /home/user/organizar_downloads.sh >> /home/user/cron.log 2>&1\n```\n• **Por que caminho completo (`/home/user/...`)?** O `cron` roda em segundo plano sem saber em qual pasta você estava no terminal.\n• Você pode abrir o editor com `crontab -e`, colar essa linha e gravar (`^O` e `^X`), **ou** instalar direto via pipe e conferir com `crontab -l`:\n`printf '30 2 * * * /home/user/organizar_downloads.sh >> /home/user/cron.log 2>&1\\n' | crontab - && crontab -l`",
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
    "description": "Hora de juntar tudo em um fluxo real de produção! Crie `rotina_noturna.sh` com 4 etapas dentro dele: (1) mover `downloads/*.pdf` para `downloads/documentos/`, (2) apagar `.tmp` de `downloads/` com `find`, (3) espelhar `documents/` em `backups/documents/` via `rsync -a`, e (4) gravar `Rotina OK` em `rotina.log`.\nDepois dê `+x`, **teste rodando `./rotina_noturna.sh` antes** e agende às **03:00** (`0 3 * * *`) no `crontab` apontando para `/home/user/rotina.log`.",
    "hint": "**Quebre o desafio em 4 passos (nunca agende no cron sem testar antes!):**\n1. Crie `rotina_noturna.sh` juntando um comando abaixo do outro:\n```bash\n#!/bin/bash\nmv downloads/*.pdf downloads/documentos/\nfind downloads -type f -name \"*.tmp\" -delete\nrsync -a documents/ backups/documents/\necho \"Rotina OK\" >> rotina.log\n```\n2. Dê permissão: `chmod +x rotina_noturna.sh`\n3. Teste na mão e confira `cat rotina.log`: `./rotina_noturna.sh`\n4. Agende às `03:00` (`minuto=0`, `hora=3`) com caminhos completos:\n`printf '0 3 * * * /home/user/rotina_noturna.sh >> /home/user/rotina.log 2>&1\\n' | crontab -`",
    "answer": "cat << 'EOF' > rotina_noturna.sh\n#!/bin/bash\nmv downloads/*.pdf downloads/documentos/\nfind downloads -type f -name \"*.tmp\" -delete\nrsync -a documents/ backups/documents/\necho \"Rotina OK\" >> rotina.log\nEOF\nchmod +x rotina_noturna.sh && ./rotina_noturna.sh && printf '0 3 * * * /home/user/rotina_noturna.sh >> /home/user/rotina.log 2>&1\\n' | crontab -",
    "answerSteps": [
      "cat << 'EOF' > rotina_noturna.sh\n#!/bin/bash\nmv downloads/*.pdf downloads/documentos/\nfind downloads -type f -name \"*.tmp\" -delete\nrsync -a documents/ backups/documents/\necho \"Rotina OK\" >> rotina.log\nEOF",
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
    "hint": "**Entendendo as flags:**\n• `-t ed25519`: escolhe o algoritmo moderno **Ed25519** (rápido e seguro, padrão atual em relação ao antigo RSA).\n• Ele gera a chave privada (`id_ed25519`) e a chave pública (`id_ed25519.pub`) dentro de `~/.ssh/`.\nExecute `ssh-keygen -t ed25519`",
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
    "hint": "**Formato INI:** nomes entre colchetes `[grupo]` definem o grupo, e cada servidor vai em uma linha abaixo dele.\nVocê pode criar com `nano inventory.ini` ou direto via here-doc:\n```ini\n[webservers]\nweb1\nweb2\n\n[databases]\ndb1\n```",
    "answer": "cat << 'EOF' > inventory.ini\n[webservers]\nweb1\nweb2\n\n[databases]\ndb1\nEOF",
    "answerSteps": [
      "cat << 'EOF' > inventory.ini\n[webservers]\nweb1\nweb2\n\n[databases]\ndb1\nEOF"
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
    "hint": "**Anatomia do comando Ansible ad-hoc:**\n• `all`: alvo (todos os hosts do inventário; poderia ser um grupo como `webservers`).\n• `-i inventory.ini`: informa qual arquivo de **inventário** usar.\n• `-m ping`: qual **módulo** executar.\nExecute `ansible all -i inventory.ini -m ping`",
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
    "hint": "**Novidade aqui (`-a` = argumentos):**\n• Alvo `webservers` filtra só `web1` e `web2` (sem tocar no `db1`).\n• `-m shell` permite operadores Bash como `&&`, `|`, `>`.\n• `-a \"...\"` passa o comando remoto entre aspas.\nExecute `ansible webservers -i inventory.ini -m shell -a \"uptime && df -h\"`",
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
    "hint": "Aponte o alvo diretamente para o host `db1`, informe `-i inventory.ini` e use o módulo `-m setup`.\nExecute `ansible db1 -i inventory.ini -m setup`",
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
    "hint": "**Parâmetros do módulo `copy` (dentro de `-a`):**\n• `-b` (`--become`): equivale ao `sudo` remoto.\n• `src=`: arquivo local na sua máquina; `dest=`: destino no servidor; `mode=0644`: permissão final.\nExecute `ansible webservers -i inventory.ini -b -m copy -a \"src=index.html dest=/var/www/html/index.html mode=0644\"`",
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
    "hint": "**Divida em 2 módulos com `-b` (`sudo` remoto):**\n1. Instalar pacote via `-m apt -a \"name=nginx state=present\"` (`present` = garantir que está instalado).\n2. Subir e habilitar no boot via `-m service -a \"name=nginx state=started enabled=yes\"`.\nLigue os dois com `&&` ou rode um de cada vez!",
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
    "hint": "**Regra de ouro do YAML:** use **apenas espaços (2 espaços por nível)**, nunca `Tab`!\nCrie `webserver.yml` (via `nano` ou `cat << 'EOF'`) e rode com `ansible-playbook -i inventory.ini webserver.yml`:\n```yaml\n- name: Configurar servidores web\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Instalar nginx\n      apt: name=nginx state=present\n    - name: Iniciar nginx\n      service: name=nginx state=started enabled=yes\n```",
    "answer": "cat << 'EOF' > webserver.yml\n- name: Configurar servidores web\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Instalar nginx\n      apt: name=nginx state=present\n    - name: Iniciar nginx\n      service: name=nginx state=started enabled=yes\nEOF\nansible-playbook -i inventory.ini webserver.yml",
    "answerSteps": [
      "cat << 'EOF' > webserver.yml\n- name: Configurar servidores web\n  hosts: webservers\n  become: yes\n  tasks:\n    - name: Instalar nginx\n      apt: name=nginx state=present\n    - name: Iniciar nginx\n      service: name=nginx state=started enabled=yes\nEOF",
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
    "hint": "Como o `webserver.yml` já instalou e iniciou o Nginx na etapa anterior, basta rodar de novo para ver **`changed=0`**:\n`ansible-playbook -i inventory.ini webserver.yml`",
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
    "hint": "**Combinando flags de segurança:**\n• `--check`: modo simulação (*dry-run*), não muda nada nos servidores.\n• `--diff`: mostra em verde/vermelho exatamente o que mudaria nos arquivos.\nExecute `ansible-playbook -i inventory.ini deploy.yml --check --diff` (dica: `-CD` também funciona!).",
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
    "hint": "Leia primeiro com `cat vars_app.yml` para ver como o bloco `vars:` define `app_env` e como `{{ app_env }}` injeta esse valor.\nDepois execute `ansible-playbook -i inventory.ini vars_app.yml`",
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
    "hint": "Veja o conteúdo com `cat nginx_config.yml`: observe que a tarefa chama `notify: Restart nginx`, e a seção `handlers:` lá embaixo recebe esse aviso apenas se houver alteração real.\nDepois execute `ansible-playbook -i inventory.ini nginx_config.yml`",
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
    "hint": "Leia primeiro `cat loop_when.yml` para enxergar `{{ item }}` junto de `loop:` e a condição `when:`.\nDepois rode `ansible-playbook -i inventory.ini loop_when.yml` e note `skipping: [db1]` no firewall!",
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
    "hint": "Rode `ansible-playbook -i inventory.ini infra.yml` uma vez para aplicar e observe os `changed`; em seguida rode exatamente o mesmo comando uma 2ª vez e comprove `changed=0` no `PLAY RECAP`!",
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
    "hint": "**Raciocínio de investigação em 2 passos:**\n1. Filtre a falha HTTP no log com `grep 404 /var/log/nginx/access.log`.\n2. Confira as portas abertas/serviços em escuta com `ss -tulpn` (`t`=TCP, `u`=UDP, `l`=listening, `p`=processo, `n`=portas numéricas).",
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
    "hint": "**Diagnóstico → Ação → Persistência:**\n1. Confira o estado com `systemctl status postgresql` (ou `is-active`).\n2. Suba agora com `sudo systemctl start postgresql`.\n3. Garanta que volte sozinho após reiniciar a máquina com `sudo systemctl enable postgresql` (ou use `sudo systemctl enable --now postgresql` direto!).",
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
    "hint": "**Nunca use `rm` aqui — você quer só tirar do *staging*!**\n1. Inspecione com `git status`.\n2. Desfaça o `git add` apenas do `.env`: `git restore --staged .env` (ou `git reset HEAD .env`).\n3. Agora commite com segurança só o `app.js`: `git commit -m \"deploy app\"`",
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
    "hint": "**Ordem obrigatória no Docker (de cima para baixo):**\n1. Parar o contêiner em execução: `docker stop travado`\n2. Remover o contêiner parado: `docker rm travado` (ou `docker rm -f travado`)\n3. Só agora o Docker libera remover a imagem base: `docker rmi nginx`",
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
    "hint": "**Pipeline em 3 etapas encadeadas:**\n1. Exportar do banco salvando com `>`: `sqlite3 -csv gym.db \"SELECT name FROM members WHERE city = 'Tokyo';\" > tokyo.csv`\n2. Comprimir mantendo o `.csv` original (`-k` = *keep*): `gzip -k tokyo.csv`\n3. Gerar assinatura de integridade: `sha256sum tokyo.csv.gz`",
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
    "hint": "**Como diagnosticar e corrigir em produção:**\n1. Confira `ls -l deploy.sh`: vai faltar o `x` nas permissões (`rw-r--r--`).\n2. Libere execução com `chmod +x deploy.sh` e rode com `./deploy.sh`.",
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

