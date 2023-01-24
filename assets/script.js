const err = document.querySelector('.err');
const search = document.querySelector('.search');
const submit = document.querySelector('.submit');
const username1 = document.querySelector('.username');
const balance = document.querySelector('.balance');
const account_creation = document.querySelector('.account_creation');
const last_login = document.querySelector('.last_login');
const verified = document.querySelector('.verified');
const verified_by = document.querySelector('.verified_by');
const verified_date = document.querySelector('.verified_date');
const achievements = document.querySelector('.achievements');
const stake_amount = document.querySelector('.stake_amount');
const stake_date = document.querySelector('.stake_date');
const warnings = document.querySelector('.warnings');
const items = document.querySelector('.items');
const miners = document.querySelector('.miners');
const prices = document.querySelector('.prices');
const info = document.querySelector('.info');
const loader = document.querySelector('.loading');
const item_box_prices = document.querySelector('.item_box_prices');
const latest_transactions = document.querySelector('.latest_transactions');
let transactions_amount = [],
transactions_id = []

search.addEventListener('keydown', e => {
    if (e.code == 'Enter') {
        lookup(search.value)
    }
})

submit.addEventListener('click', () => lookup(search.value))

function lookup(value) {
    // err.style.display='block';
    loader.style.display='block';
    setTimeout(() => {
        loader.style.display='none';
    }, 1000)
    fetch(`https://server.duinocoin.com/v2/users/${value}`)
    .then(res => res.json())
    .then(username => {
        if (username.success == false) {
            err.innerText = 'Invalid Username!';
            return;
        }

        info.style.display='block';

        item_box_prices.innerHTML='';
        latest_transactions.innerHTML='';

        const data_prices = username.result.prices,
        data_prices_keys = Object.keys(data_prices),
        data_prices_values = Object.values(data_prices);

        for(let price_i=0; price_i < data_prices_keys.length; price_i++) {
            item_box_prices.innerHTML += `
            <li>${data_prices_keys[price_i]}: ${data_prices_values[price_i]}</li>
            `
        }

        chart1('chart_prices', 'Prices', data_prices_keys, data_prices_values)

        err.style.display='none';
        username1.innerText=username.result.balance.username;
        balance.innerText=username.result.balance.balance + ' DUCO';
        account_creation.innerText=username.result.balance.created;
        last_login.innerText=username.result.balance.last_login;
        verified.innerText=username.result.balance.verified;
        verified_by.innerText=username.result.balance.verified_by;
        verified_date.innerText=username.result.balance.verified_date;
        achievements.innerText=username.result.achievements;
        stake_amount.innerText=username.result.balance.stake_amount + ' DUCO';
        stake_date.innerText=username.result.balance.stake_date;
        warnings.innerText=username.result.balance.warnings;
        items.innerText=JSON.stringify(username.result.items);
        miners.innerText=JSON.stringify(username.result.miners);
        username.result.transactions.forEach(e => {
            latest_transactions.innerHTML+=`
        <div>
            <div class="amount">Amount: <span>${e.amount} DUCO</span></div>
            <div class="sender">Sender: <span>${e.sender}</span></div>
            <div class="recipient">Recipient: <span>${e.recipient}</span></div>
            <div class="datetime">Date Time: <span>${e.datetime}</span></div>
            <div class="hash">Hash: <span>${e.hash}</span></div>
            <div class="id">ID: <span>${e.id}</span></div>
            <div class="memo">Memo: <span>${e.memo}</span></div>
        </div>
            `
            transactions_amount.push(e.amount);
            transactions_id.push(String('ID: ' + e.id));
        })
        chart1('chart_transactions', 'Amount (DUCO)', transactions_id, transactions_amount)
        // prices.innerText=JSON.stringify(username.result.prices);

    })
}

function chart1(elem, label, labels, data) {
    e1 = document.getElementById(elem);
    e1.innerHTML = '';
    const e = document.createElement('canvas');
    e1.append(e);

    const ctx = e;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
}

