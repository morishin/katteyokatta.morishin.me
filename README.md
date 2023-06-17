# 買ってよかったもの

https://katteyokatta.morishin.me/

## Concept

https://morishin.hatenablog.com/entry/release-katteyokatta

<table>
  <thead>
    <tr style="text-align: center">
      <th></th>
      <td>投稿する人</td>
      <td>見る人</td>
    </tr>
  </thead>
  <tbody>
    <tr style="height:20px; text-align: center;">
      <td>疑いようのない欲求</td>
      <td>自分の好きなものを
        <br>人にも好きになって欲しい</td>
      <td>生活の質を上げる良いモノを買いたい
        <br>
      </td>
    </tr>
    <tr style="height:20px; text-align: center;">
      <td>何をすれば手に入る？</td>
      <td>買ってよかった商品を
        <br>紹介できる場があれば</td>
      <td>
        <div style="width: 341px; left: -3px;">知人・他人の買ってよかった商品を
          <br> 見られる場があってすぐに購入できれば
        </div>
      </td>
    </tr>
    <tr style="height:20px; text-align: center;">
      <td>
        <div style="width: 170px; left: -24px;"> =solution
          <br>How to do?
          <br> =action</div>
      </td>
      <td colspan="2">買ってよかったものをAmazonリンク付きでまとめてシェアできるWebサービス
        <br>「買ってよかったもの」</td>
    </tr>
    <tr style="height:20px; text-align: center;">
      <td>成功のイメージ
        <br>「やったぁ〜！」の共有</td>
      <td colspan="2">みんなの「買ってよかった」体験がシェアされることで
        <br>みんなが良い買い物をし、生活の質が上がっている
      </td>
    </tr>
    <tr style="height:20px; text-align: center;">
      <td>指標</td>
      <td colspan="2">Amazonリンクから購入へのコンバージョン率</td>
    </tr>
  </tbody>
</table>

## Development

### Setup

Install dependencies.

```sh
$ npm i
```

Copy and edit an env file.

```sh
$ cp .env.development.example .env.development
```

### Run

Run database.

```sh
$ docker-compose -f compose.yml up
```

Run migration.

```sh
$ npm run prisma:migrate:dev
```

Run app.

```sh
$ npm run dev
```
