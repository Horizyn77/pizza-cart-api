function PizzaCart() {
    return {
        pizzas: [],
        username: "Horizyn77",
        cartId: "",
        cartPizzas: [],
        total: 0,
        paymentAmount: "",
        paymentMessage: "",
        msgStyle: "",
        featuredPizzas: [],
        showHistoricalOrders: false,
        historicalOrderIds: [],
        historicalOrdersList: [],
        init() {

            this.getFeaturedList();

            const url = "https://pizza-api.projectcodex.net/api/pizzas";

            axios.get(url)
                .then(result => {
                    this.pizzas = result.data.pizzas;
                })

            this.createCart();

        },
        createCart() {
            axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
                .then(result => {
                    this.cartId = result.data.cart_code;
                    this.showCart();
                })
        },
        getCart() {

            const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;

            return axios.get(url)

        },
        addPizza(pizzaId) {
            const url = "https://pizza-api.projectcodex.net/api/pizza-cart/add";

            return axios.post(url, {
                "cart_code": this.cartId,
                "pizza_id": pizzaId
            })
        },
        removePizza(pizzaId) {
            const url = "https://pizza-api.projectcodex.net/api/pizza-cart/remove";

            return axios.post(url, {
                "cart_code": this.cartId,
                "pizza_id": pizzaId
            })
        },
        showCart() {
            this.getCart().then(result => {
                this.cartPizzas = result.data.pizzas;
                this.total = result.data.total;
            })
        },
        addPizzaToCart(pizzaId) {
            this.addPizza(pizzaId).then(() => {
                this.showCart();
            })
        },
        removePizzaFromCart(pizzaId) {
            this.removePizza(pizzaId).then(() => {
                this.showCart();
            })
        },
        pay() {

            const url = "https://pizza-api.projectcodex.net/api/pizza-cart/pay"

            return axios.post(url, {
                "cart_code": this.cartId,
                "amount": this.paymentAmount
            })
        },
        payForCart() {
            this.pay().then(result => {

                if (result.data.status == "failure") {
                    this.paymentMessage = result.data.message;
                    this.msgStyle = true;

                    setTimeout(() => {
                        this.paymentMessage = "";
                    }, 3000)
                } else {
                    this.paymentMessage = result.data.message;
                    this.msgStyle = false;

                    setTimeout(() => {
                        this.cartPizzas = [];
                        this.cartId = "";
                        this.total = 0;
                        this.paymentAmount = 0;
                        this.paymentMessage = "";
                        this.createCart();
                    }, 3000)
                }
            })
        },
        addFeatured(pizzaId) {

            return axios.post("https://pizza-api.projectcodex.net/api/pizzas/featured", {
                "username": this.username,
                "pizza_id": pizzaId
            })
        },
        addToFeaturedList(pizzaId) {
            this.addFeatured(pizzaId).then(() => {
                this.getFeaturedList();
            })
        },
        getFeaturedList() {

            const url = `https://pizza-api.projectcodex.net/api/pizzas/featured?username=${this.username}`

            axios.get(url).then(result => {
                this.featuredPizzas = result.data.pizzas;
            })
        },
        historicalOrders() {
            
            if (!this.showHistoricalOrders) {
                this.showHistoricalOrders = true;
            } else {
                this.showHistoricalOrders = false;
            }
            axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
                .then(result => {
                    const paidOrders = result.data.filter(item => item.status == "paid")
                    this.historicalOrderIds = paidOrders.map(item => item.cart_code)
                    this.getHistoricalOrders()
                })
        },
        getHistoricalOrders() {
            this.historicalOrderIds.forEach(item => {
                axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/${item}/get`)
                    .then(result => this.historicalOrdersList.push(result.data))
            })
        }

    }
}

document.addEventListener("alpine:init", () => {
    Alpine.data("pizzaCart", PizzaCart)
});