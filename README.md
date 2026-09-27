#### PUC-MVP-Sprint-1-Frontend
*Projeto da página da internet da primeira sprint na pós graduação em Engenharia de Software.*


# PROXIER®

Frontend do **PROXIER®**, um jogo de cartas no estilo **Print and Play**, desenvolvido com HTML, CSS e JavaScript.

A aplicação permite ao usuário criar e acessar uma conta, selecionar cartas disponíveis, definir quantidades para impressão, gerenciar sua lista de cartas e solicitar o envio. O frontend realiza a comunicação com uma API backend para armazenamento e consulta dos usuários e das listas de cartas.

## Arquitetura do sistema

<img width="1751" height="929" alt="PUCSprint4-Arquitetura png" src="https://github.com/user-attachments/assets/dfc7e75a-206a-422a-ad03-cf6c487cc149" />

## Tecnologias utilizadas

* **HTML5** — estrutura da aplicação;
* **CSS3** — estilização e layout da interface;
* **JavaScript** — lógica da aplicação e interação com o usuário;
* **Fetch API** — comunicação entre o frontend e o backend (API);

## Funcionalidades

* Cadastro de novos usuários;
* Login de usuários;
* Exibição do usuário atualmente logado;
* Apresentação das cartas disponíveis em carrossel;
* Seleção de cartas;
* Definição da quantidade de cartas;
* Criação e gerenciamento da lista de impressão;
* Remoção de cartas da lista (banco de dados no backend);
* Consulta de endereço a partir do CEP (API externa pelo backend);
* Preenchimento automático dos dados de endereço (pela resposta da API externa);
* Solicitação de envio das cartas;
* Integração com API backend para persistência dos dados.

## Estrutura do projeto

A estrutura esperada para o frontend é semelhante a:

```text
PROXIER/
├── index.html
├── style.css
├── script.js
└── img/
    ├── header-img.png
    ├── carta-001.png
    ├── carta-002.png
    ├── carta-003.png
    ├── carta-004.png
    └── carta-005.png
```

## Pré-requisitos

Para executar o frontend, é necessário possuir:

* Um navegador moderno, como Google Chrome, Mozilla Firefox ou Microsoft Edge;
* Os arquivos do projeto;
* O **backend da aplicação** executando localmente;
* A API backend disponível em:

```text
http://localhost:3000
```

O frontend utiliza endpoints da API para realizar operações de usuários, cartas e consulta de CEP.

## Instalação

### 1. Clone o repositório

Caso o projeto esteja hospedado em um repositório Git:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre no diretório do projeto:

```bash
cd PROXIER
```

### 2. Verifique os arquivos

Certifique-se de que os arquivos principais estejam disponíveis:

```text
index.html
style.css
script.js
img/
```

As imagens das cartas e do cabeçalho devem permanecer no diretório `img/`, pois são referenciadas diretamente pelo HTML.

### 3. Configure o backend

O frontend depende de uma API executada localmente na porta `3000`. Disponibilizado em: 

```text
https://github.com/tcgCamara/PUC-MVP-Sprint4-Backend
```

Portanto, antes de utilizar todas as funcionalidades da aplicação, certifique-se de que o backend esteja instalado e em execução em:

```text
http://localhost:3000
```

> **Observação:** as instruções específicas de instalação e inicialização do backend estão no link acima.

## Execução com Docker

Para executar o projeto utilizando Docker, certifique-se de que o **Docker** e o **Docker Compose** estejam instalados e disponíveis no ambiente.

### 1. Criar a imagem do projeto

Na raiz do projeto, execute:

```bash
docker build -t proxier-frontend .
```

### 2. Executar o container

Após a criação da imagem, execute:

```bash
docker run -d -p 8080:80 proxier-frontend
```

A aplicação estará disponível em:

```text
http://localhost:8080
```



## Fluxo básico de utilização

1. Acesse a aplicação;
2. Crie um usuário informando nome, CPF e e-mail;
3. Realize o login utilizando o nome cadastrado;
4. Selecione uma carta no carrossel ou informe seu nome manualmente;
5. Defina a quantidade desejada;
6. Adicione a carta à lista de impressão;
7. Consulte ou remova cartas da lista conforme necessário;
8. Informe o CEP para consultar o endereço;
9. Confira os dados do endereço;
10. Solicite o envio da lista.

## Observações

O projeto possui uma separação entre **frontend** e **backend**. O frontend é responsável pela interface e pelas interações com o usuário, enquanto a persistência dos dados é realizada pela API no backend.

As validações realizadas no JavaScript incluem, entre outras:

* Verificação de usuário logado;
* Validação básica de CPF;
* Validação básica de e-mail;
* Validação de quantidade de cartas;
* Validação do CEP;
* Verificação dos dados de endereço;
* Verificação da existência de cartas antes da solicitação de envio.

## Rotas da API

O frontend do PROXIER® realiza requisições HTTP para uma API backend executada localmente na porta `3000`.

A URL base utilizada pelo frontend é:

```text
http://localhost:3000
```

## Rotas de acesso da API

| Método   | Rota                                 | Finalidade                                       |
| -------- | ------------------------------------ | ------------------------------------------------ |
| `GET`    | `/usuario?nome={nome}`               | Consulta um usuário para realizar o login        |
| `POST`   | `/usuario`                           | Cadastra um novo usuário                         |
| `POST`   | `/carta`                             | Adiciona uma carta à lista de um usuário         |
| `GET`    | `/cartas?nome={nome}`                | Consulta as cartas da lista de um usuário        |
| `DELETE` | `/cartas`                            | Remove uma carta da lista de um usuário          |
| `GET`    | `/buscacep?cep={cep}`                | Consulta os dados de endereço a partir de um CEP |
| `DELETE` | `/cartasdousuario?usuario={usuario}` | Remove todas as cartas da lista de um usuário    |

---

### 1. Consultar usuário

**Método:** `GET`

**Rota:**

```text
/usuario?nome={nome}
```

Utilizada durante o processo de login para verificar se o usuário informado está cadastrado.

**Exemplo:**

```text
GET http://localhost:3000/usuario?nome=Joao
```

**Parâmetro:**

| Parâmetro | Tipo     | Descrição                           |
| --------- | -------- | ----------------------------------- |
| `nome`    | `string` | Nome do usuário que será consultado |

---

### 2. Cadastrar usuário

**Método:** `POST`

**Rota:**

```text
/usuario
```

Utilizada para cadastrar um novo usuário no sistema.

**Corpo da requisição:**

```json
{
    "nome": "Joao",
    "cpf": "12345678900",
    "email": "joao@email.com"
}
```

**Campos:**

| Campo   | Tipo     | Descrição         |
| ------- | -------- | ----------------- |
| `nome`  | `string` | Nome do usuário   |
| `cpf`   | `string` | CPF do usuário    |
| `email` | `string` | E-mail do usuário |

A requisição utiliza o cabeçalho:

```http
Content-Type: application/json
```

---

### 3. Adicionar carta à lista

**Método:** `POST`

**Rota:**

```text
/carta
```

Utilizada para adicionar uma carta à lista de impressão do usuário logado.

**Corpo da requisição:**

```json
{
    "usuario": "Joao",
    "carta": "Transportador de Pacotes",
    "quantidade": 2
}
```

**Campos:**

| Campo        | Tipo     | Descrição                      |
| ------------ | -------- | ------------------------------ |
| `usuario`    | `string` | Usuário responsável pela lista |
| `carta`      | `string` | Nome da carta                  |
| `quantidade` | `number` | Quantidade de cópias da carta  |

---

### 4. Consultar lista de cartas

**Método:** `GET`

**Rota:**

```text
/cartas?nome={nome}
```

Utilizada para recuperar as cartas cadastradas na lista de impressão de determinado usuário.

**Exemplo:**

```text
GET http://localhost:3000/cartas?nome=Joao
```

**Parâmetro:**

| Parâmetro | Tipo     | Descrição                                  |
| --------- | -------- | ------------------------------------------ |
| `nome`    | `string` | Nome do usuário cuja lista será consultada |

O frontend espera receber uma estrutura contendo a lista de cartas, por exemplo:

```json
{
    "lista": [
        {
            "carta": "Transportador de Pacotes",
            "quantidade": 2
        },
        {
            "carta": "Legião Inabalável",
            "quantidade": 1
        }
    ]
}
```

---

### 5. Remover carta da lista

**Método:** `DELETE`

**Rota:**

```text
/cartas
```

Utilizada para remover uma carta específica da lista do usuário.

**Corpo da requisição:**

```json
{
    "usuario": "Joao",
    "carta": "Transportador de Pacotes"
}
```

**Campos:**

| Campo     | Tipo     | Descrição                     |
| --------- | -------- | ----------------------------- |
| `usuario` | `string` | Usuário proprietário da lista |
| `carta`   | `string` | Carta que será removida       |

A requisição utiliza:

```http
Content-Type: application/json
```

---

### 6. Consultar CEP

**Método:** `GET`

**Rota:**

```text
/buscacep?cep={cep}
```

Utilizada para consultar os dados de endereço a partir do CEP informado pelo usuário.

**Exemplo:**

```text
GET http://localhost:3000/buscacep?cep=20040020
```

**Parâmetro:**

| Parâmetro | Tipo     | Descrição                   |
| --------- | -------- | --------------------------- |
| `cep`     | `string` | CEP utilizado para consulta |

O frontend espera receber informações de endereço contendo os seguintes campos:

```json
{
    "bairro": "Centro",
    "cidade": "Rio de Janeiro",
    "estado": "Rio de Janeiro",
    "estadouf": "RJ",
    "rua": "Avenida Exemplo"
}
```

Essas informações são utilizadas para preencher automaticamente os campos de endereço da tela.

---

### 7. Remover todas as cartas do usuário

**Método:** `DELETE`

**Rota:**

```text
/cartasdousuario?usuario={usuario}
```

Utilizada após a solicitação de envio para remover todas as cartas atualmente presentes na lista do usuário.

**Exemplo:**

```text
DELETE http://localhost:3000/cartasdousuario?usuario=Joao
```

**Parâmetro:**

| Parâmetro | Tipo     | Descrição                                |
| --------- | -------- | ---------------------------------------- |
| `usuario` | `string` | Nome do usuário cuja lista será removida |

Após uma resposta bem-sucedida, o frontend atualiza a tabela de cartas apresentada ao usuário.
