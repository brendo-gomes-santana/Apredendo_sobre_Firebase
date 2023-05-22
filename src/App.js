import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import { collection, 
  addDoc, doc, getDocs, 
  updateDoc, deleteDoc, onSnapshot,
 } from  'firebase/firestore'

import { createUserWithEmailAndPassword, 
          signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged } from "firebase/auth";
import style from './style.module.css'

function App() {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost]= useState('')

  const [posts, setPosts] = useState([])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const [user,setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})
  useEffect(()=> {
    (async ()=>{
      onSnapshot(collection(db, "posts"), (snapShot)=> {
        let lista = []

        snapShot.forEach((doc)=> {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            atuor: doc.data().autor
          })
        })

        setPosts(lista)
      })
    })
    
    ()

  },[])

  useEffect(()=> {
    (()=> {

      onAuthStateChanged(auth, (user)=> {
        if(user){
          // tem user logado
          setUser(true)
          console.log(user)
          setUserDetail({
            id: user.uid,
            email: user.email
          })
        }else{
          //não possui nem um user logado
          setUser(false)
          setUserDetail({})
        }
      })

    })()
  },[])

  async function handleAdd(e){
    e.preventDefault()
    if(!autor || !titulo){
      alert('Preenchar as informações')
      return;
    }
    /*
    tem que importa o setDoc e doc
    await setDoc(doc(db, 'posts', '12345'), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('Dados Registrado no banco')
    })
    .catch((error)=> {
      console.log('gerou error' + error)
    })
    */
   await addDoc(collection(db, "posts"), {
    titulo,
    autor
   })
   .then(()=> {
    alert('Cadastrado com sucesso')
    setAutor('')
    setTitulo('')
   })
   .catch((error)=> {
    alert('Algo deu Errado')
    console.log(error)
   })
  }

  async function buscarpost(){
    /*
    esse aqui é buscando um posts só
    const postRef = doc(db, 'posts', '12345')
    await getDoc(postRef)
    .then((snapShot)=> {
      setAutor(snapShot.data().autor)
      setTitulo(snapShot.data().titulo)
    })
    .catch(()=> {
      console.log('Error')
    })
    */
    const postsRef = collection(db, 'posts')
    await getDocs(postsRef)
    .then((snapShot)=> {
      let lista = []

      snapShot.forEach((doc)=> {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          atuor: doc.data().autor
        })
      })
      console.log(lista)
      setPosts(lista)
    })
    .catch((error)=> {
      console.log(error)
    })
  }

  async function HandleAditar(){

    if(!autor || !titulo){
      alert('Preenchar todas as informações')
      return;
    }

   const docRef = doc(db, "posts", idPost)
   await updateDoc(docRef, {
    titulo,
    autor
   })
   .then(()=> {
    alert('Atualizando com sucesso')
    setAutor('')
    setTitulo('')
    setIdPost('')
   })
   .catch((error)=> {
    console.log(error)
   })
  }
  async function ExcluirPosts(id_post){
    const docRef = doc(db, 'posts', id_post)
    await deleteDoc(docRef)
    .then(()=> {
      alert('deletado com sucesso')
    })
    .catch((error)=> {
      console.log(error)
    })
  }

  async function handleNovoUsuario(e){
    e.preventDefault()
    await createUserWithEmailAndPassword(auth, email, password)
    .then((value)=> {
      console.log(value)
      alert('Cadatrando com sucesso')
      setEmail('')
      setPassword('')
    })
    .catch((error)=> {
      if(error.code === 'auth/weak-password'){
        alert('senha muito fraca')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('Email já existe')
      }
    })
  }
  async function handleLogin(){
    await signInWithEmailAndPassword(auth, email, password)
    .then((value)=> {
      console.log(value.user)
      alert('logado')
      setUserDetail({
        id: value.user.uid,
        email: value.user.email
      })
      setUser(true)
      setEmail('')
      setPassword('')
    })
    .catch((error)=> {
      console.log(error)
      alert('Senha ou email incorreto')
    })
  }
  
  async function SairDaConta(){
    await signOut(auth)
    .then(()=> {
      alert('Sair com sucesso')
      setUser(false)
    }).catch(()=> {
      alert('Algo deu errado')
    })
  }


  return (
    <div className={style.container}>

      <div>
        <h1>Id do post:</h1>
        <input 
        placeholder="Digite o id Do post"
        value={idPost}
        onChange={(v)=> setIdPost(v.target.value)}
        />
        
      </div>

      <form onSubmit={handleAdd}>
        <label>Titulo</label>
        <textarea placeholder="Digite o titulo"
        value={titulo} onChange={(v)=> setTitulo(v.target.value)}/>

        <label>Autor:</label>
        <input type="text" placeholder="Autor do post"
        value={autor} onChange={(v)=> setAutor(v.target.value)}/>
        <button type="submit">Cadastrar</button>
      </form>
        <button onClick={buscarpost}>Buscar posts</button>
        <button onClick={HandleAditar}>Atulizar posts</button>
      <section>
        {posts.map( (item)=> {
          return(
            <p key={item.id}>{item.titulo} - {item.atuor} - <string>{item.id } 
            <button onClick={()=> ExcluirPosts(item.id)}>Excluir</button></string></p>
          )
        })}
      </section>
      <br/><br/>
      <section>
        <form onSubmit={handleNovoUsuario}>
          <label>Email: </label>
          <input placeholder="Digite seu email"
          value={email} onChange={v => setEmail(v.target.value)}/>

          <label>Password: </label>
          <input type="password" placeholder="Digite seu sua senha"
          value={password} onChange={v => setPassword(v.target.value)}/>
          <button type='submit'>cadastrar</button>
        </form>
        <button onClick={handleLogin}>Fazer login</button>
      </section>
      <section>
        {user && (
          <div>
            <strong>Seja bem vindo</strong>
            <span>id: { userDetail.id }</span><br/>
            <span>email: {userDetail.email } </span>
            <button onClick={SairDaConta}>Sair da conta</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
