const express = require('express');
const supabase = require("./supabase");

var app = express();
app.use(express.json());


// get All the users
const getAllUsers = async () => {
    const {data, error} = await supabase.from('user_investment').select('*');
    if(!error) {
        console.log(data)
        return data
    }
}


const calculateInterestOnMonthEnd = async (user) => {
    // interest rate 2%
    const interestRate = 0.02;
    const {data, error} = await supabase.from('user_investment').select('investment').eq('user_name', user);
    if(data) {
        console.log(data[0])
        // interest for a specific user
        var interest = 0;
        // balance amount
        var amount = 0;
        data[0].investment.forEach((elem, index) => {
            // balance added or opening date
            const start_date = new Date(elem.start_date)
            // balance withdraw or closing date
            const end_date = new Date(elem.end_date)
            const totalDays = (end_date - start_date)/(1000*3600*24)+1;
            if(elem.action === 'withdraw') {
                amount -= elem.amount
                interest += (((totalDays)*interestRate)/365)*amount
            } else {
                amount += elem.amount;
                interest += (((totalDays)*interestRate)/365)*amount
            }
        })
        return interest.toFixed(2)
    }
}

app.get('/', async function(req, res) {
    const usersData = await getAllUsers();
    const users = [];
    usersData.forEach((elem) => {
        users.push(elem.user_name)
    })
    res.send(users.join(', '));
});

app.get('/:userName', async function(req, res) {
    const getInterestOnMonthEnd = await calculateInterestOnMonthEnd(req.params.userName);
    res.send('interest calculated '+ getInterestOnMonthEnd +' for ' + req.params.userName)
})

app.listen(5000, () => {
    console.log('Node server listening on port 5000')
});