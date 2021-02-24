// require('dotenv').config()
const fs = require('fs')
const path = require('path')
import { WebClient } from "@slack/web-api";
const S1 = require('s1db')
const db = new S1(process.env.S1_TOKEN)

export default async (req, res) => {
  const client = new WebClient();
  
  // const context = require.context('../../public/images', true)
  // console.log('current directory', __dirname)
  // let photos = context.keys()
  // let photo = photos[Math.floor(Math.random() * photos.length)].substr(2)
  // console.log('setting profile picture to', photo)
  // const image = await fs.readFileSync('./images/' + photo) // ./public/images/ if testing locally

  const dirRelativeToPublicFolder = 'images'
  const dir = path.resolve('./public', dirRelativeToPublicFolder);
  const filenames = fs.readdirSync(dir);
  const images = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))
  const photo = images[Math.floor(Math.random() * images.length)]
  console.log('photo directory', photo)
  const image = await fs.readFileSync('./public' + photo)
  console.log('image', image)

  const slackRequest = await client.users.setPhoto({
    image: image,
    token: process.env.SLACK_TOKEN,
  }).then((r) => {
    console.log('success')
    res.status(200).end()
  }).catch(err => {
    console.log('error', err)
    res.status(502).end()
  })
};
