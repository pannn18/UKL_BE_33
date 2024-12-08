import Express from 'express'
import UserRoute from "./Router/userRoute"
import ItemRoute from "./Router/itemRoute"
import BorrowRoute from "./Router/borrowRoute"

const app = Express()

app.use(Express.json())

app.use(`/user`, UserRoute)
app.use(`/item`, ItemRoute)
app.use(`/api`, BorrowRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})