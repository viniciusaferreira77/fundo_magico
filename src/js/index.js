document.addEventListener("DOMContentLoaded", function() { 
    // Espera o  carregamento completo da pagina antes de realizar as execuções do script
    // alert("Fundo Mágico carregado com sucesso!"); aparece como alerta
    console.log("Página carregada com sucesso!"); //aparece dentro do console do navegador.
    // Aqui você pode adicionar mais código que precisa ser executado após o carregamento da página 
    // não queremos recarregar pagina por isso vamos incluir isso no js
    //1 pegar o evento submit do formulário para evitar o recarregamento da página
    const formulario = document.querySelector(".form-group");
    //2 obter valor do imput de texto
    const descricaoInput = document.getElementById("description");
    // buscar o html e exibir o reultado 
    const codigoHtml = document.getElementById("html-code"); 
    //e buscar o codigo do css
    const codigoCss = document.getElementById("css-code"); // buscar o css e exibir o resultado
    const secaoPreview = document.getElementById("preview-section");


    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault(); // Evita o recarregamento da página


        //2 obter valor do input de texto
        const descricao = descricaoInput.value.trim(); // busca o valor digitado no input

        //console.log("Descrição digitada: " + descricao); // Exibe no console o valor digitado, somente para verificação
        if(!descricao){
            return; // se o campo estiver vazio, não faz nada
        }

        //3 exibir um indicador de carregamento enquanto a requisição está sendo processada
        //mostrarCarregamento(true); teste para ver se funciona mostrarCarregamento();

        //4 fazer UMA REQUISIÇÃO http (post) PARA O api DO N8N, ENVIANDO O TEXTO DO FORMULÁRIUO NO CORPO DA REQUISIÇÃOI EM FORMATO JSON
        try{
            const resposta = await fetch("https://geovanas.app.n8n.cloud/webhook/fundo-magico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ descricao})
            });
            const dados = await resposta.json();
            //console.log(dados); assim para gerar dados so api no console, para teste
            codigoHtml.textContent = dados.html || ""; //se nao tiver nada, deixa vazio
            codigoCss.textContent = dados.css || ""; // se nao tiver nada, deixa vazio
            secaoPreview.style.display = "block"; // mostra a seção de preview 
            secaoPreview.innerHTML = dados.html || ""; // adiciona o html gerado na seção de preview

            // colocar o fundo mágico na página
            let tagEstilo = document.getElementById("estilo-dinamico");

            //se ja existir uma tag de estilo com esse id, remover ela antes de criar uma nova
            if(tagEstilo){
                tagEstilo.remove(); // remove o estilo antigo se ja existir
            }
            if(dados.css){
                tagEstilo = document.createElement("style");// cria uma nova tag de estilo
                tagEstilo.id = "estilo-dinamico";
                tagEstilo.textContent = dados.css; // adiciona o css gerado na tag de estilo
                document.head.appendChild(tagEstilo); // adiciona a tag de estilo no head do documento
            }
        }catch(error){
            console.error("Erro ao gerar o background mágico:", error);
            codigoHtml.textContent = "Erro ao gerar o html mágico.";
            codigoCss.textContent = "Erro ao gerar o css mágico.";
            secaoPreview.innerHTML = "";

        }finally{
            mostrarCarregamento(false);
        }

    });
              
    //passo 3: função para mostrar o indicador de carregamento
    function mostrarCarregamento(estaCarregando) {
        const botaoEnviar = document.getElementById('generate-btn');
        if(estaCarregando) {
            botaoEnviar.textContent = "Carregando background..."; // Altera o texto do botão para indicar carregamento
        }else{
            botaoEnviar.textContent = "Gerar background Mágico"; // Restaura o texto original do botão
        }
    }

    
});
