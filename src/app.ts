import express from 'express';
import { router } from './routers';
import bodyParser from 'body-parser';

const app = express()
const port = 1234

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
