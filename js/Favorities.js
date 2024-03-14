import { GithubUser } from "./GithubUser.js";

export class Favorities {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load()
    
  }

  checkEmpty() {
    const emptyState = this.root.querySelector("#nodisplay")
    this.entries.length <= 0 ? emptyState.classList.remove("close") : emptyState.classList.add("close")
  }      

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorities:')) || []
    
  }

  save(){
    localStorage.setItem('@github-favorities:', JSON.stringify(this.entries))
  }

  async add(username){
    try{
        const userExists = this.entries.find(entry => entry.login === username)
        
        if(userExists){
            throw new Error('Usuário já cadstrado')
        }

        const user = await GithubUser.search(username)

        if(user.login === undefined){
            throw new Error('Usuário não encontrado')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

    }catch(error){
        alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritiesView extends Favorities {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
        const { value } = this.root.querySelector('.search input')

        this.add(value)
    }
  }

  update() {
    this.removeAllTr();

    const close = document.getElementById('nodisplay')
    close.classList.toggle('close')
     
    this.entries.forEach( user => {
        const row = this.createRow()
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.followers').textContent = user.followers
        row.querySelector('a').href = `https://github.com/${user.login}`

        row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha')
            if(isOk){
                this.delete(user)
            }
        }

        this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <tr>
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="imagem de paulo sergio">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>Mayk Brito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        </tr>`
     
    return tr
  }

  removeAllTr() {

    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });

  }
}
