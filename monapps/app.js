var express=require('express');
var fs =require('fs')
var app=express();
var bodyParser=require('body-parser')
var mysql=require('./mysql')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

mysql.conn.connect((err)=>{
    if(err) return err
    console.log("connected")
})


app.get("/api/etudiants",(req,res,next)=>{
    //listes des etudiants

    mysql.conn.query("select *from etudiant;",(err,rows,fields)=>{
        res.status('200').json(rows);
    })
    
}).get("/api/etudiants/:numEt",(req,res,next)=>{
    //liste d'un etudiant
    console.log("Liste d'un etudiant : "+req.params.numEt);
    mysql.conn.query("select *from etudiant where numEt=?;",req.params.numEt,(err,rows,fields)=>{
        res.status('200').json(rows);
    })
    
}).post("/api/etudiants",(req,res,next)=>{

    //ajouter un etudiant
    console.log("Ajouter etudiant");
    var a=[req.body.numEt,req.body.nom,req.body.niveau];
    mysql.conn.query("select *from etudiant where numEt=?",req.body.numEt,(err,rows,fields)=>{
        if(err) throw err;
        if(rows.length==0){
            mysql.conn.query("insert into etudiant(numEt,nom,niveau) values (?,?,?)",a,(err,row,fields)=>{
                if(err) throw err;
                res.status("200").send("L'etudiant est ajouté avec succès");
            })
        }else{
            res.status("200").send("Le numero d'etudiant inseré est déja occupé!");
        }
    })
    
}).delete("/api/etudiants/:numEt",(req,res,next)=>{
    console.log(req.params.numEt);
    mysql.conn.query("delete from etudiant where numEt=? ;",[req.params.numEt],(err,rows,fields)=>{
        if(err) throw err;
        
        res.status("200").send("L'etudiant est supprimé avec succès");
    })
    
}).put("/api/etudiants/:numEt",(req,res)=>{
    //modifier un etudiant
    if(req.body.numEt==req.params.numEt){
        var requete=[req.body.nom,req.body.niveau,req.params.numEt];
        mysql.conn.query("update  etudiant set nom=?, niveau=? where numEt=? ;",requete,(err,rows,fields)=>{
            if(err) throw err;
            
            res.status('200').send("L'étudiant est modifié avec succès");
        })
    }else{
        mysql.conn.query("select *from etudiant where numEt=?",[req.body.numEt],(err,rows,fields)=>{
            if(err) throw err;
            if(rows.length==0){
                
                var requete1=[req.body.numEt,req.body.nom,req.body.niveau,req.params.numEt];
                mysql.conn.query("update  etudiant set numEt=? ,nom=?, niveau=? where numEt=? ;",requete1,(err,rows,fields)=>{
                    if(err) throw err;
                    
                    res.status('200').send("L'étudiant est modifié avec succès");
                })
            }else{
                res.status("200").send("Le numero modifié est deja enregistré avec un autre etudiant!")
            }
        })
    }
    

}).get("/api/etudiants/search/:mot",(req,res)=>{
    //rechercher etudiant par nom ou numero
    console.log("recherche :"+req.params.mot);
    mysql.conn.query("select *from etudiant where numEt like ? or nom like ? ;",["%"+req.params.mot+"%","%"+req.params.mot+"%"],(err,rows,fields)=>{
        if(err) throw err;
        return res.status('200').json(rows);
    })

}).get('/api/matieres',(req,res,next)=>{
    console.log("listes des matieres")
    mysql.conn.query("select *from matiere;",(err,rows,fields)=>{
        if(err) throw err;
        res.status('200').json(rows);
    })
    
}).post("/api/matieres",(req,res,next)=>{
    //api ajouter matiere
    var a=[req.body.codemat,req.body.libelle,req.body.coefficient];

    mysql.conn.query("select *from matiere where codemat=?",req.body.codemat,(err,rows,fields)=>{
        if(err) throw err;
        if(rows.length==0){
            mysql.conn.query("insert into matiere(codemat,libelle,coef) values (?,?,?)",a,(err,row,fields)=>{
                if(err) throw err;
                res.status("200").send("La matiere est ajoutée avec succès");
            })
        }else{
            res.status("200").send("Le numero de matiere inseré est déja occupé!");
        }
    })

}).delete("/api/matieres/:codemat",(req,res,next)=>{
    console.log(req.params.codemat);
    mysql.conn.query("delete from matiere where codemat=? ;",[req.params.codemat],(err,rows,fields)=>{
        if(err) throw err;
        
        res.status("200").send("La matiere est supprimé avec succès");
    })
    
}).put("/api/matieres/:codemat",(req,res)=>{
    //modifier un etudiant
    console.log("Modifier matiere :"+req.params.codemat)
    if(req.body.codemat==req.params.codemat){
        var requete=[req.body.libelle,req.body.coef,req.params.codemat];
        mysql.conn.query("update  matiere set libelle=?, coef=? where codemat=? ;",requete,(err,rows,fields)=>{
            if(err) throw err;
            
            res.status('200').send("La matiere est modifié avec succès");
        })
    }else{
        mysql.conn.query("select *from matiere where codemat=?",[req.body.codemat],(err,rows,fields)=>{
            if(err) throw err;
            if(rows.length==0){
                
                var requete1=[req.body.codemat,req.body.libelle,req.body.coef,req.params.codemat];
                mysql.conn.query("update  matiere set codemat=? ,libelle=?, coef=? where codemat=? ;",requete1,(err,rows,fields)=>{
                    if(err) throw err;
                    
                    res.status('200').send("La matiere est modifié avec succès");
                })
            }else{
                res.status("200").send("Le codemat modifié est deja enregistré avec un autre maitere!")
            }
        })
    }
    

}).get('/api/notes',(req,res)=>{
    console.log("listes des notes")
    mysql.conn.query("select *from note;",(err,rows,fields)=>{
        if(err) throw err;
        res.status('200').json(rows);
    })
}).post("/api/notes",(req,res,next)=>{
     //ajouter un etudiant
     console.log("Ajouter Note");
     var a=[req.body.numEt,req.body.codemat,req.body.note];
    mysql.conn.query("select *from note where codemat=? and numEt=?;",[req.body.codemat,req.body.numEt],(err,rows,fields)=>{
        if(err) throw err;
        if(rows.length==0){
            mysql.conn.query("insert into note(conteur,numEt,codemat,note) values (0,?,?,?)",a,(err,rows,fields)=>{
                if(err) throw err;
                res.status("200").send("Le note est ajouté avec succès");
            })
        }else{
            res.status("200").send("L'etudiant a deja un note sur ce matiere!");
        }
    })
}).put("/api/notes/:conteur",(req,res,next)=>{
    console.log("Modifier notes"+req.body.numEt);
    mysql.conn.query("select *from note where numEt=? and codemat=? and conteur!=?;",[req.body.numEt,req.body.codemat,req.params.conteur],(err,rows,fields)=>{
        if (err) throw err;
        if(rows.length==0){
            var variable=[req.body.numEt,req.body.codemat,req.body.note,req.params.conteur];
            mysql.conn.query("update note set numEt=? , codemat=?,note=? where conteur=?;",variable,(err,rows,fields)=>{
                if(err) throw err;
                res.status("200").send("Le note est modifié avec succes")
            })
        }else{
            res.status("200").send("L'etudiant a deja un note sur ce matiere!");
        }
    })
    //res.status("200").send("okok "+req.params.conteur );
}).delete("/api/notes/:conteur",(req,res,next)=>{
    console.log(req.params.conteur);
    mysql.conn.query("delete from note where conteur=? ;",[req.params.conteur],(err,rows,fields)=>{
        if(err) throw err;
        
        res.status("200").send("Le note est supprimé avec succès");
    })
    
}).get("/api/classement",(req,res,next)=>{
    console.log("Classement des etudiants");
    mysql.conn.query("select etudiant.numEt, etudiant.nom , sum(note.note*matiere.coef)/sum(matiere.coef) as moyenne from etudiant,note,matiere where etudiant.numEt=note.numEt and matiere.codemat=note.codemat group by etudiant.numEt order by moyenne desc;",(err,rows,fields)=>{
        if(err) throw err;
        res.status('200').json(rows);
    })
    //res.status("200").send("ok ko")
}).get("/api/bulletin/:numEt",(req,res,next)=>{
    console.log("Bulletin de note d'etudiant  numero : "+req.params.numEt);
    mysql.conn.query("select matiere.libelle,matiere.coef,note.note,(matiere.coef*note.note) as ponderee from note,matiere,etudiant where matiere.codemat=note.codemat and etudiant.numEt=note.numEt and etudiant.numEt=?",req.params.numEt,(err,rows,fields)=>{
        if(err) throw err;
        res.status('200').json(rows);
    })
    //res.status("200").send("ok ko")
}).get("/api/observation/:numEt",(req,res,next)=>{
    console.log("Observation de note d'etudiant  numero : "+req.params.numEt);
    mysql.conn.query("select sum(note.note*matiere.coef)/sum(matiere.coef) as moyenne, if((sum(note.note*matiere.coef)/sum(matiere.coef))>=10,'admis',if((sum(note.note*matiere.coef)/sum(matiere.coef))>=7.5,'redoublant','renvoye')) as observation from note,matiere,etudiant where matiere.codemat=note.codemat and etudiant.numEt=note.numEt and etudiant.numEt=?",req.params.numEt,(err,rows,fields)=>{
        if(err) throw err;
        res.status('200').json(rows);
    })
    //res.status("200").send("ok ko")
});




app.listen(8081,()=>{
    console.log("Runnning server at http://127.0.0.1:8081")
})