// 1. Configurar o cliente Supabase
const supabaseUrl = 'https://nghaaxntzgsvqrvcrokq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naGFheG50emdzdnFydmNyb2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzE0NzIsImV4cCI6MjA1OTYwNzQ3Mn0.lRD7Lp8UgiFYjwmvr0YGQFkgXtyg8aK_Qu3ijffoVic';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const editor = document.getElementById('editor');

// ---
// FUNÇÃO PARA OBTER O ID DO PROJETO DA URL
// ---
function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    // Assumimos que o parâmetro na URL se chama 'projeto_id'. Ajuste se for diferente.
    return params.get('projeto_id');
}

// ---
// FUNÇÃO PARA CARREGAR O TEXTO DO SUPABASE
// ---
async function loadInitialText() {
    const projectId = getProjectIdFromUrl();

    // Se não houver ID na URL, não faz a busca e exibe um erro
    if (!projectId) {
        editor.innerHTML = '<p>Erro: ID do projeto não encontrado na URL.</p>';
        console.error('ID do projeto não fornecido na URL.');
        return;
    }

    // Busque a linha da tabela 'inspecao' com o ID do projeto
    const { data, error } = await supabase
        .from('inspecao')
        .select('observacoes, medidaproposta, multa, nr, iteminfringido')
        .eq('id', projectId) // Filtra pela coluna 'id' com o valor do projetoId
        .single();

    if (error) {
        console.error('Erro ao buscar o texto:', error.message);
        editor.innerHTML = `<p>Erro ao carregar os dados. Verifique o ID: ${projectId}</p>`;
    } else if (data) {
        // Monta o texto inicial com os dados recebidos do Supabase
        const initialText = `
            <p>Observação: ${data.observacoes || ''}</p>
            <p>Medida Proposta: ${data.medidaproposta || ''}</p>
            <p>Multa: R$${data.multa || ''}</p>
            <p>NR: ${data.nr || ''}</p>
            <p>Infração: ${data.iteminfringido || ''}</p>
        `;
        // Define o HTML do editor com o texto formatado
        editor.innerHTML = initialText;
        console.log('Dados carregados e editor atualizado com sucesso!');
    } else {
        // Se a busca não retornar dados
        console.log('Nenhum dado encontrado para o ID:', projectId);
        editor.innerHTML = '<p>Nenhum texto encontrado para este projeto.</p>';
    }
}

// ---
// CHAMA A FUNÇÃO AO CARREGAR A PÁGINA
// ---
document.addEventListener('DOMContentLoaded', loadInitialText);

// ---
// RESTO DO SEU CÓDIGO (SEM ALTERAÇÕES)
// ---
function formatDoc(command, value = null) {
    if (command === 'createLink') {
        const url = prompt('Insira o URL:');
        if (url) {
            document.execCommand(command, false, url);
        }
    } else {
        document.execCommand(command, false, value);
    }
}

function findUnderlinedText(text) {
    const regex = /_([^_]+)_/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

function findAsteriskText(text) {
    const regex = /\*([^*]+)\*/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

document.getElementById('saveButton').addEventListener('click', async () => {
    const rawText = editor.innerText;
    const extractedUnderlines = findUnderlinedText(rawText);
    const extractedAsterisks = findAsteriskText(rawText);

    if (extractedUnderlines.length === 0 || extractedAsterisks.length === 0) {
        alert("O texto precisa ter palavras entre underlines e asteriscos para salvar.");
        return;
    }
    if (extractedUnderlines.length !== extractedAsterisks.length) {
        alert("O número de palavras com underline e asterisco não corresponde. Verifique seu texto.");
        return;
    }
    const dataToInsert = extractedUnderlines.map((word, index) => ({ 
        palavra: word,
        significado: extractedAsterisks[index]
    }));

    const { data, error } = await supabase
        .from('memoryhack')
        .insert(dataToInsert);

    if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Ocorreu um erro ao salvar o texto.');
    } else {
        console.log('Dados salvos com sucesso:', data);
        alert('As partes do texto foram salvas com sucesso!');
    }
});

function formatFontSize() {
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const selectedSize = fontSizeSelect.value;
    document.execCommand('fontSize', false, selectedSize);
}