/* eslint-disable no-undef */
function selectOption() {
  const buttons = document.querySelectorAll('.container button');
  const select = document.querySelector('select');
  const textArea = document.querySelector('textarea');
  buttons.forEach((button) => {
    button.addEventListener('click', ({ target }) => {
      const storage = JSON.parse(localStorage.forms);
      const keyForm = target.parentNode.classList[1];
      const selected = document.querySelector(`.${keyForm} .selected`);
      if (selected) selected.classList.remove('selected');
      storage[keyForm] = target.innerText;
      localStorage.forms = JSON.stringify(storage, 2);
      target.classList.toggle('selected');
    });
  });
  select.addEventListener('click', ({ target }) => {
    const storage = JSON.parse(localStorage.forms);
    const keyForm = target.parentNode.classList[1];
    storage[keyForm] = target.value;
    localStorage.forms = JSON.stringify(storage, 2);
  });
  textArea.addEventListener('keyup', ({ target }) => {
    const storage = JSON.parse(localStorage.forms);
    const keyForm = target.parentNode.classList[1];
    const textValue = document.querySelector('textarea').value;
    const count = document.querySelector('.count');
    const len = textValue.length;
    count.innerText = len;
    if (len < 15) count.style.color = 'yellow';
    if (len >= 15) count.style.color = '#edf0ff';
    if (len === 200) count.style.color = 'red';
    storage[keyForm] = textValue;
    localStorage.forms = JSON.stringify(storage, 2);
  });
}

function addElement(element, name, result, percentage) {
  const pElement = document.createElement('p');
  pElement.innerText = `${name}: ${result}`;
  const col1 = document.createElement('div');
  col1.append(pElement);
  const col2 = document.createElement('div');
  col2.classList.add('result-percent');
  col2.innerHTML = `${percentage}%`;
  element.appendChild(col1);
  element.appendChild(col2);
}

function calcPercent(total, num) {
  return (num * 100) / total;
}

function handleSubmit() {
  const button = document.querySelector('#submit');
  button.addEventListener('click', async () => {
    const storage = JSON.parse(localStorage.forms);
    let ok = true;
    Object.entries(storage).forEach((pergunta) => {
      if (!pergunta[1]) {
        ok = false;
        document.querySelector(`.${pergunta[0]}`).classList.add('problem');
      }
    });
    if (!ok) alert('os campos destacados não foram informados!');
    else if (storage.pergunta4.length < 15) {
      ok = false;
      document.querySelector('.pergunta4').classList.add('problem');
      alert('Sua resposta deve ter pelomenos 15 caracteres');
    }

    if (ok) {
      const url = 'http://localhost:3000/submit';
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storage),
      });
      const {
        QuantidadePositiva, QuantidadeNegativa, QuantidadeNaoAvaliada,
      } = await request.json();
      const main = document.querySelector('main');
      const quantidadePositivaElement = document.createElement('div');
      quantidadePositivaElement.name = QuantidadePositiva;
      quantidadePositivaElement.classList.add('quantidade-positiva');

      const quantidadeNegativaElement = document.createElement('div');
      quantidadeNegativaElement.name = QuantidadeNegativa;
      quantidadeNegativaElement.classList.add('quantidade-negativa');

      const quantidadeNaoAvaliadaElement = document.createElement('div');
      quantidadeNaoAvaliadaElement.name = QuantidadeNaoAvaliada;
      quantidadeNaoAvaliadaElement.classList.add('quantidade-nao-avaliada');

      addElement(quantidadePositivaElement, 'Quantidade positiva', QuantidadePositiva, calcPercent(4, QuantidadePositiva));
      addElement(quantidadeNegativaElement, 'Quantidade negativa', QuantidadeNegativa, calcPercent(4, QuantidadeNegativa));
      addElement(quantidadeNaoAvaliadaElement, 'Quantidade não avaliada', QuantidadeNaoAvaliada, calcPercent(4, QuantidadeNaoAvaliada));

      const arrayOfElements = [
        quantidadePositivaElement,
        quantidadeNegativaElement,
        quantidadeNaoAvaliadaElement,
      ];

      arrayOfElements.sort((a, b) => Number(b.name) - Number(a.name));
      arrayOfElements.forEach((element) => main.appendChild(element));
    }
  });
}

// eslint-disable-next-line no-undef
const formsObject = {
  pergunta1: '',
  pergunta2: '',
  pergunta3: '',
  pergunta4: '',
};

window.onload = () => {
  localStorage.clear();
  localStorage.setItem('forms', JSON.stringify(formsObject, 2));
  selectOption();
  handleSubmit();
};
