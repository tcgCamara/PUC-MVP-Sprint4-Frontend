
var conjuntoDeCartas = document.querySelectorAll(".carta-para-selecionar")


// CRIANDO um carrossel para apresentação das cartas

let indiceCarrossel = 0;

const moverCarrossel = (direcao) => {
    const container = document.querySelector('.container-carta-select');
    const cartas = document.querySelectorAll('.carta-para-selecionar');
    const totalCartas = cartas.length;
    
    // AJUSTA quantas cartas aparecem por vez na tela definido no CSS pelo % do Flex em 'carta-para-selecionar'
    const cartasVisiveis = 3; 
    const maxIndice = totalCartas - cartasVisiveis;

    // ATUALIZA o índice respeitando os limites iniciais e finais
    indiceCarrossel += direcao;

    if (indiceCarrossel < 0) {
        indiceCarrossel = 0; // Trava no início
    } else if (indiceCarrossel > maxIndice) {
        indiceCarrossel = maxIndice; // Trava no fim
    }

    // CALCULA a largura de uma carta + o espaçamento (gap) para mover com precisão
    const larguraCarta = cartas[0].getBoundingClientRect().width;
    const gap = 20; // O mesmo valor usado no gap do CSS
    const deslocamento = indiceCarrossel * (larguraCarta + gap);

    // APLICA o movimento usando CSS transform
    container.style.transform = `translateX(-${deslocamento}px)`;
}



const escolhaDeCarta = (elemento) => {
    let cartaSelecionada = elemento.target.attributes.dataid.nodeValue
    let bancoDeCartas = ["","Transportador de Pacotes", "Legião Inabalável", "Julgado pelo Sistema", "Colar de Genohackeamento", "Cache de Reaproveitamento"]
    let nomeDaCarta = bancoDeCartas[cartaSelecionada]

    conjuntoDeCartas.forEach((carta) => {
        let atributo = carta.getAttribute("dataid")
        
        if (atributo == cartaSelecionada) {
            carta.classList.add("carta-selecionada")
        } else {
            carta.classList.remove("carta-selecionada")
        }
    });

    let textoAlterado = document.getElementById('inputCard')
    textoAlterado.value = nomeDaCarta

    let qtdCartas = document.getElementById("inputQuantidadeDeCartas")
    qtdCartas.value = 1
}


// Como todas as cartas para seleção têm o mesmo style CSS, foi adicionado um "eventlistener"
// para que seja aplicado a mesma função de "ao clicar" a todas elas. 
conjuntoDeCartas.forEach(carta => {
    carta.addEventListener('click', escolhaDeCarta)
})

//Para informar ao usuário de que a carta foi adicionada a lista de impressão
//ou que ele ainda precisa selecionar ou escrever uma carta
const adicionarCarta = async () => {
    var cartaParaAdicionar = document.getElementById("inputCard")
    var quantidadeDeCartas = document.getElementById("inputQuantidadeDeCartas")
    var usuarioLogado = document.getElementById("usuario-logado").textContent
    
    if (cartaParaAdicionar.value == "") {
        alert(`Escolha ou escreva qual carta desejada antes de adicionar.`)
        return
    }
    if (quantidadeDeCartas.value == 0 || quantidadeDeCartas.value == null || isNaN(quantidadeDeCartas.value)) {
        alert(`Você precisa escolher uma quantidade válida de cartas.`)
        return
    }
    if (usuarioLogado == "") {
        alert("Você precisa realizar login para adicionar suas cartas.")
        return
    }

    // FETCH-ES
    try {
        await adicionarListaNoBanco(usuarioLogado, cartaParaAdicionar.value, quantidadeDeCartas.value)
        deletarTodaListaApresentada()
        let listaBase = await buscarListaDoUsuario(usuarioLogado)
        atualizarListaDoUsuario(listaBase)
        
        alert(`Você adicionou ${quantidadeDeCartas.value}x [${cartaParaAdicionar.value}] à sua lista de impressão!`)
        cartaParaAdicionar.value = ""
        quantidadeDeCartas.value = null

    } catch (e) {
        console.error('Error: ', e)
    }
}

// UMA VEZ VALIDADAS, as cartas são inseridas no banco para registro na lista do usuário.  
const adicionarListaNoBanco = async (user, crt, qtd) => {
    let lista = {
        "usuario": user,
        "carta": crt,
        "quantidade": qtd
    }
    let url = "http://localhost:3000/carta"

    try {
        let response = await fetch(url,
            {method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lista)})
        let data = await response.json()

    } catch (e) {
        console.error('Error: ', e)
    }
}

// EM UM FUTURO, esta função chamaria "deletarTodaListaApresentada", "buscarListaDousuario" e "atualizarListaDoUsuario"
// Ela poderá ser reutilizada em dois momentos deste código
// const atualizarListaApresentada = (usuario) => {
    // deletarTodaListaApresentada()
    // buscarListaDoUsuario(usuario)
    // atualizarListaDoUsuario(usuario)
// }

// FUNÇÃO para buscar todas as cartas na lista do usuário logo assim que ele logar
const deletarTodaListaApresentada = () => {
    let tabela = document.getElementById('minha-tabela')
    let linhas = tabela.querySelectorAll('tbody tr')

    linhas.forEach((elemento) => {
            elemento.remove()
    })
}

// AO REALIZAR a inserção de uma nova carta em sua lista ou realizar o login,
// a aplicação deve buscar no banco as cartas registradas para fazer a atualização
const buscarListaDoUsuario = async (user) => {

    let url = 'http://localhost:3000/cartas?nome=' + user

    try {
        let response = await fetch(url)
        let data = await response.json()
        return data
    } catch (e) {
        console.error('Error: ', e)
    }
}

// UMA VEZ as cartas buscadas no backend, 
// o front precisa organizar e inserir esta lista na tabela de apresentação
const atualizarListaDoUsuario = (listaBase) => {
    //formato dos dados {"Lista": [{"carta": "XXX", "quantidade": #}, {...}, ...]} => Lista[0].carta e Lista[0].quantidade
    let tabela = document.getElementById("minha-tabela")
    
    //console.log(listaBase["lista"].length)
    
    listaBase.lista.forEach((item, indice) => {
        console.log('Entrou na linha ' +indice)
        var row = tabela.tBodies[0].insertRow()

        let celulaUm = row.insertCell(0)
        celulaUm.textContent = item.carta
        let celulaDois = row.insertCell(1)
        celulaDois.textContent = item.quantidade
        let celulaTres = row.insertCell(-1)
        removedorDeLinha(celulaTres)

    })    
}

// PARA CONSEGUIR excluir a carta (linha da tabela), 
// é necessário inserir no elemento responsável a função que fará a ação de remover
const removedorDeLinha = (celula) => {
    let span = document.createElement('span')
    span.className = 'excluir-linha'
    span.textContent = "X"

    celula.addEventListener('click', function(event) {
        removerLinhaDoBanco(event)
    })

    celula.appendChild(span)

}

// REMOVENDO a mesma linha do banco de dados
// Envia para o backend os dados para remoção do banco de dados daquele usuário logado.
const removerLinhaDoBanco = async (event) => {
    let linhaTabela = event.target.closest('tr')
    let celulasDaLinha = linhaTabela.querySelectorAll('td')
    let cartaDaLinha = celulasDaLinha[0].textContent.trim() //esse trim é novo pra mim (rimou)
    let usuario = document.getElementById('usuario-logado').textContent

    let url = 'http://localhost:3000/cartas'

    const dadosParaDeletar = {
        "usuario": usuario,
        "carta": cartaDaLinha 
    }

    try {
        let response = await fetch(url, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosParaDeletar)
        })
        let data = await response.json()
        console.log(data)
        linhaTabela.remove()

    } catch (e) {
        console.error('Error: ', e)
    } 
}


// PARA CRIAR novos usuários, 
// é necessário fazer a validação (básica) no front
const validarCriarUsuario = () => {
    let userNome = document.getElementById("inputUsuario")
    let userCpf = document.getElementById("inputCPF")
    let userEmail = document.getElementById("inputEmail")

    if (String(userCpf.value.length) != 11) {
        alert("CPF do usuário deve conter 11 dígitos.")
        return 
    }

    if (!userEmail.value.includes('@') || !userEmail.value.includes('.com')) {
        alert("Formato de e-mail inválido.")
        return
    }

    if (userNome.value == "") {
        alert("Digite um nome do usuário para cadastro")
        return
    }

    postCriarUsuario(userNome.value, String(userCpf.value), userEmail.value)

    userNome.value = ""
    userCpf.value = ""
    userEmail.value = ""
}

// UMA VEZ os dados de novo usuário validado, 
// é inserido no backend o novo usuário cadastrado
const postCriarUsuario = async (nome, cpf, email) => {
    const dados = { 
        'nome': nome, 
        'cpf': cpf,
        'email': email
    }

    let url = 'http://localhost:3000/usuario'
    
    try {
        let response = await fetch(url, {
            method: 'post', 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(dados)
        })
        let data = await response.json()

    } catch (e) {
        console.error('Error: ', e)
    }
}

//O usuário só poderá construir sua lista a partir do momento que estiver "logado"
const logandoUsuario = async () => {
    let entradaLogin = document.getElementById("inputLogin").value

    if (entradaLogin == "") {
        alert("Insira um login antes de iniciar a sessão.")
        return
    }

    acessarUsuario(entradaLogin)
}

const acessarUsuario = async (entradaLogin) => {
    //ENVIA a requisição de login
    let usuarioLogado = document.getElementById("usuario-logado")

    let url = "http://localhost:3000/usuario?nome=" + entradaLogin

    try {
        let response = await fetch(url, {method: 'get' })
        let data = await response.json()

        if (response.ok) {        
            usuarioLogado.textContent = data.nome
            document.getElementById("inputLogin").value = ""
            alert(`Usuário ${data.nome} foi logado com sucesso!`)

            deletarTodaListaApresentada()
            let listaBase = await buscarListaDoUsuario(data.nome) 
            atualizarListaDoUsuario(listaBase)

        } else {
            alert("Usuário não encontrado no sistema!")
            return
        }

    } catch (e) {
        console.error("Erro ao logar: ", e)
    }
}


// TRECHO para solicitação de envio da lista

// VERIFICAR se existe usuário logado

function usuarioEstaLogado() {
    const usuario = document.getElementById("usuario-logado").textContent.trim()
    return usuario !== "";
}

// VALIDAR o CEP

function validarCEP() {
    const campoCEP = document.getElementById("inputCEPEnvio")
    const cep = campoCEP.value.trim()

    // CEP deve conter somente números
    if (!/^\d+$/.test(cep)) {
        alert("Informe um CEP contendo apenas números.")
        return false
    }

    // CEP deve possuir exatamente 8 números
    if (cep.length !== 8) {
        alert("O CEP deve possuir 8 números.")
        return false
    }

    return true
}


// PESQUISAR o CEP

async function pesquisarCEP() {

    // VERIFICAR se usuário está logado
    if (!usuarioEstaLogado()) {
        alert("É necessário estar logado para pesquisar um CEP.")
        return
    }

    // VERIFICAR a condição do CEP
    if (!validarCEP()) {
        return
    }

    const cep = document.getElementById("inputCEPEnvio").value.trim()

    try {
        const response = await fetch(`http://localhost:3000/buscacep?cep=${cep}`)

        if (!response.ok) {
            throw new Error("CEP não encontrado.")
        }

        const data = await response.json()

        // PREENCHER os campos retornados pela API automaticamente
        document.getElementById("inputBairro").value = data.bairro || "";
        document.getElementById("inputCidade").value = data.cidade || "";
        document.getElementById("inputEstado").value = data.estado || "";
        document.getElementById("inputUF").value = data.estadouf || "";
        document.getElementById("inputRua").value = data.rua || "";

    } catch (error) {
        console.error(error)
        alert("Não foi possível localizar o CEP informado.")
    }
}


// VERIFICAR se o endereço foi preenchido

function enderecoEstaPreenchido() {

    const bairro = document.getElementById("inputBairro").value.trim()
    const cidade = document.getElementById("inputCidade").value.trim()
    const estado = document.getElementById("inputEstado").value.trim()
    const uf = document.getElementById("inputUF").value.trim()
    const rua = document.getElementById("inputRua").value.trim()

    if (!bairro) {
        alert("O campo Bairro não foi preenchido.")
        return false
    }

    if (!cidade) {
        alert("O campo Cidade não foi preenchido.")
        return false
    }

    if (!estado) {
        alert("O campo Estado não foi preenchido.")
        return false
    }

    if (!uf) {
        alert("O campo Estado - UF não foi preenchido.")
        return false
    }

    if (!rua) {
        alert("O campo Rua não foi preenchido.")
        return false
    }

    return true
}


// VERIFICAR se existe carta na lista


function possuiCartasNaLista() {
    const linhas = document.querySelectorAll("#minha-tabela tbody tr")

    if (linhas.length === 0) {
        alert("Adicione pelo menos uma carta à lista de pedidos.")
        return false
    }

    return true
}


// REALIZAR a solicitação de envio

async function solicitarEnvio() {

    // VERIFICAR se usuário está logado
    if (!usuarioEstaLogado()) {
        alert("É necessário estar logado para solicitar o envio.");
        return
    }

    // VERIFICAR se existe pelo menos uma carta
    if (!possuiCartasNaLista()) {
        return
    }

    // VERIFICAR se o CEP é válido
    if (!validarCEP()) {
        return
    }

    // VERIFICAR se todos os campos do endereço estão preenchidos
    if (!enderecoEstaPreenchido()) {
        return
    }

    
    const usuario = document.getElementById("usuario-logado").textContent.trim()
    const cep = document.getElementById("inputCEPEnvio").value.trim()
    const bairro = document.getElementById("inputBairro").value.trim()
    const cidade = document.getElementById("inputCidade").value.trim()
    const estado = document.getElementById("inputEstado").value.trim()
    const uf = document.getElementById("inputUF").value.trim()
    const rua = document.getElementById("inputRua").value.trim()

    console.log({
        usuario,
        cep,
        bairro,
        cidade,
        estado,
        uf,
        rua
    });

    alert("Solicitação de envio realizada com sucesso.")

    let cartasDeletadas = await deletarBancoDeCartasDoUsuario(usuario)

    if (cartasDeletadas) {
        deletarTodaListaApresentada()
        let listaBase = await buscarListaDoUsuario(usuario)
        atualizarListaDoUsuario(listaBase)
    }
}


const deletarBancoDeCartasDoUsuario = async (usuario) => {
    let url = 'http://localhost:3000/cartasdousuario?usuario=' + usuario

    try {
        let response = await fetch(url, {method: 'delete'})
        if (response.ok){
            return true
        }
        
    } catch (e) {
        console.error('Error: ', e)
    }

    return false
}