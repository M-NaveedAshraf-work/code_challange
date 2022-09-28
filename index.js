const express = require('express');
const supabase = require("./supabase");

var app = express();
app.use(express.json());


// get All the users
const getAllUsers = async () => {
    let res = {
        users: [],
        error: ''
    }

    const {data, error} = await supabase.from('users').select('*');
    if(!error) {
        const users = [];
        data.forEach((elem) => {
            users.push(elem.user_name)
        })
        res.status = 200;
        res.users = users;
        return res
    } else {
        res.status = 400;
        res.error = error.message;
        return res
    }
}


const calculateInterestOnMonthEnd = async (user) => {
    
    let res = {
        user: user,
        interest: '',
        error: ''
    }

    // interest rate 2%
    const interestRate = 0.02;
    const {data, error} = await supabase.from('transactions').select('*').eq('user_name', user);
    if(data) {
        console.log(data)
        // interest for a specific user
        var interest = 0;
        // balance amount
        var amount = 0;
        data.forEach((elem, index) => {
            // balance added or opening date
            const start_date = new Date(elem.transaction_date)
            // balance withdraw or closing date
            const end_date = new Date(index+1 < data.length ? data[index+1].transaction_date : 'January 31')
            const totalDays = (end_date - start_date)/(1000*3600*24)+1;
            if(elem.transaction_type === 'withdraw') {
                amount -= elem.transaction_amount
                interest += (((totalDays)*interestRate)/365)*amount
            } else {
                amount += elem.transaction_amount;
                interest += (((totalDays)*interestRate)/365)*amount
            }
        })
        res.status = 200;
        res.interest = interest.toFixed(2);
        return res
    } else {
        if(error) {
            res.status = 400;
            res.error = error.message;
            return res
        } else {
            res.status = 400;
            res.error = 'No data availble for current user';
            return res
        }
    }
}

app.get('/', async function(req, res) {
    const middleware_res = await getAllUsers();
    res.json(middleware_res);
});

app.get('/details/:userName', async function(req, res) {
    const middleware_res = await calculateInterestOnMonthEnd(req.params.userName);
    res.json(middleware_res)
})

app.listen(5000, () => {
    console.log('Node server listening on port 5000')
});