const express = require('express')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const connection = require('express-myconnection')
const optionbd = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'film_bd'

}
const app = express()
//Extraction des données du formuaire
app.use(express.urlencoded({extended: false}))

//Définition du middleware
app.use(myConnection(mysql,optionbd,'pool'))

//Définition du moteur d'affichage
app.set('view engine','ejs')
app.set( 'views','IHM')

app.get('/',(req,res)=>{
req.getConnection((erreur, connection)=>{
    if (erreur){
        console.log(erreur)
    }else{
        connection.query('select * from film', [],(erreur,resultat)=>{
            if (erreur){
                console.log(erreur)
            }else{
                res.status(200).render('index',{resultat})
            }
        })
    }
})

})

app.post("/film", (req,res)=>{
   let id = req.body.id === "" ? null : req.body.id
   let titre = req.body.titre
   let annee = req.body.annee

   let reqSql = 
   id === null 
   ? "insert into film (id,titre,annee) values (?,?,?)"
   : "update film set titre = ? ,annee = ? WHERE film.id = ?"
    let donnees = id === null ? [null,titre,annee] : [titre, annee,id]


  
    req.getConnection((erreur, connection)=>{
        if (erreur){
            console.log(erreur)
        }else{
            connection.query(reqSql, donnees,(erreur,resultat)=>{
                if (erreur){
                    console.log(erreur)
                }else{
                    res.status(300).redirect('/')
                }
            })
        }
    })
    
    })

app.delete('/film/:id', (req, res)=>{
    let id = req.params.id
    req.getConnection((erreur,connection)=>{
        if (erreur){
            console.log(erreur)
        }else{
            connection.query(
            "delete from film where id = ?",
             [id],
             (erreur,resultat)=>{
                if (erreur){
                    console.log(erreur)
                }else{
                    res.status(200).json({routeRacine: "/"})
                }
            })
        }
    })
})

app.get('/apropos',(req,res)=>{
    res.status(200).render('apropos')
})

app.use((req,res)=>{
    res.status(404).render('pageIntrouvable')
})


app.listen(3001)
console.log('Attented des requetes au port 3001')
