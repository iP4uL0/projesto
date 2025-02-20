
document.addEventListener("DOMContentLoaded", loadusers());

//Função para carregar usuários do localStorage na tabela
async function loadusers() {
    const userList = document.getElementById("userlist")
    userList.innerHTML = "";

    try{
        let resposta = await fetch("http://localhost:3000/busca")
        let users = await resposta.json();
        console.log(users)
        users.map((user) => addUserToTable(user));
    } catch (error) {
        console.error("erro ao carregar usuarios", error)
    }
}


// Adiciona um evento de "submit" ao formulário  
const botao_salvar = document.querySelector("#Salvar");  
botao_salvar.addEventListener("click", async function(event){
    event.preventDefault(); // Impede o envio do formulário
    const id = document.getElementById("userId").value;
    const name = document.getElementById("name").value; 
    const email = document.getElementById("email").value; 

    if (id) 
    {
        updateUser(id, name, email); // Se o ID existir, chama a função para atualizar o usuário  

    } else 
    {  
        await createUser(name, email); // Se não houver ID, cria um novo usuário 
    }  

     // Limpa os campos do formulário após a submissão  
});  

// criar o usuario 
async function createUser(usuario, email) {

    try {
        const response = await fetch("http://localhost:3000/usuario/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario, email,}),
        });

        if (response.ok) {
            alert("Cadastro realizado com sucesso!", "success");
            return
        } else {
            const data = await response.json();
            alert(data.error || "Erro ao realizar cadastro.", "danger");
        }
    } catch (error) {
        console.error("Erro ao fazer cadastro:", error);
        alert("Erro ao tentar cadastrar. Tente novamente mais tarde.", "danger");
    }
    
}


// Função para inserir usuário na tabela: PRONTO
function addUserToTable(user) {
    const userList = document.getElementById("userlist")

    let row = document.createElement("tr");

    let celula_nome = document.createElement("th");
    celula_nome.innerText = `${user.usuario}`;

    let celula_email = document.createElement("th");
    celula_email.innerText = `${user.email}`;

    let celula_botoes = document.createElement("th");

    let botao_editar = document.createElement("button");
    botao_editar.innerText = "Editar";
    botao_editar.addEventListener("click", () => editUser(user.id_usuario));  // Corrigido

    let botao_excluir = document.createElement("button");
    botao_excluir.innerText = "Excluir";
    botao_excluir.addEventListener("click", () => deleteUser(user.id_usuario));  // Corrigido

    celula_botoes.append(botao_editar, botao_excluir);
    row.append(celula_nome, celula_email, celula_botoes);

    // Adiciona a linha na tabela
    userList.appendChild(row);
}



//funcao excluir usuario: PRONTO
// Excluir usuário
async function deleteUser(id_usuario) {
    try {
        const res = await fetch(`http://localhost:3000/delete/${id_usuario}`,
        {
        method: "DELETE"
        });

        if (res.ok) {
            alert("Usuário excluído com sucesso!");
            loadusers()
        } else {
            alert("Erro ao excluir usuário.");
        }
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Falha ao excluir usuário.");
    }}


// Função para editar
async function editUser(usuario) {

    try {
        const res = await fetch(`http://localhost:3000/email/${usuario}`,
        {
        method: "PUT"
        });

        if (res.ok) {
            alert("Usuário editado com sucesso!");
            loadusers();
        } else {
            alert("Erro ao editar o usuário.");
        }
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        alert("Falha na edição usuário.");
        
    }
}
