
let input=document.querySelector(".input-github")
let btnGetRepo=document.querySelector(".button-github")
let MsgShow=document.querySelector(".msg-github")
let reposField=document.querySelector(".repos-field")
let repoparent=document.querySelector(".repoparent")

let inputsArray=[]

window.onload=function(){
    input.focus()
}

input.addEventListener("keypress",function(event){
    if(event.key ==="Enter"){
        event.preventDefault();
        btnGetRepo.click()
    }
})

// remove the last personal photo
function removePersonalPhoto(){
    if(reposField.children.length>3){
        reposField.children[1].remove()
    }
}
let i=0
let stars=[];
let starscont=[];

btnGetRepo.addEventListener("click",function(e){
    if(input.value==""){
        MsgShow.innerHTML="please enter your github username"

    }else if (+input.value.length>0){
        let myrequest=new XMLHttpRequest()
        myrequest.open("GET",`https://api.github.com/users/${input.value}/repos`,true)
        myrequest.send()

        myrequest.onreadystatechange=function(){
            // || data.length===0
        if(!(this.readyState===4 || this.status===200) ){
            MsgShow.innerHTML="Wrong Github Username";
            MsgShow.classList.add("wrongusername")
            removePersonalPhoto()
        }else if(this.readyState===4 && this.status===200){

            MsgShow.innerHTML=`${input.value} Reposietries List`;
            MsgShow.classList.remove("wrongusername")

            //remove the last repositries from list
            if(repoparent.hasChildNodes){
            let a=Array.from(repoparent.children);
            if(a.length>=1){
                i=0;
            for(let b of a){
                b.remove()
            }}}
            let data=JSON.parse(myrequest.responseText);

            if(data.length===0){
                MsgShow.innerHTML="Wrong Github Username";
                MsgShow.classList.add("wrongusername")
                removePersonalPhoto()
            }

            inputsArray.push(input.value)

            //create the personal photo
            let personaPhoto=data[0].owner.avatar_url;
            let personaPhotoco=document.createElement("img");
            personaPhotoco.setAttribute("src",personaPhoto)
            let linkpersonaPhotoco=document.createElement("a")
            linkpersonaPhotoco.setAttribute("href",data[0].owner.html_url)
            linkpersonaPhotoco.setAttribute("target","_blank")
            personaPhotoco.classList.add("personaPhoto")
            linkpersonaPhotoco.appendChild(personaPhotoco)
            reposField.prepend(linkpersonaPhotoco)

            removePersonalPhoto()
            
            data.forEach(function(repo){
            //create the repositories list
            let repoContainer=document.createElement("div")
            repoContainer.setAttribute("class","repoContianer")
            repoparent.appendChild(repoContainer)

            //create the repo name span
            let spanrepo=document.createElement("span")
            repoContainer.appendChild(spanrepo)
            spanrepo.textContent=`${i+1}: ${repo.name}`;
            i++

            // create the link of repo and num of stars
            let linkAndStars=document.createElement("div")
            linkAndStars.setAttribute("class","linkAndStars")
            repoContainer.appendChild(linkAndStars)

            // create the links
            let linksRepo=document.createElement("a")
            linksRepo.setAttribute("href",`https://github.com/${input.value}/${repo.name}`)
            linksRepo.setAttribute("target","_blank")
            linksRepo.textContent="Visit"
            linkAndStars.appendChild(linksRepo)

            // create the stars
            let starsRepo=document.createElement("span")
            starsRepo.setAttribute("class","starsrepo")
            starsRepo.textContent=`Stars ${repo.stargazers_count}`
            linkAndStars.appendChild(starsRepo)

            // do heilight on the repo stars of it over >= 100
            if(repo.stargazers_count >=100){
                starsRepo.closest(".repoContianer").classList.add("overHuderedStars")
            }
            if(repo.stargazers_count >=1000){
                starsRepo.closest(".repoContianer").classList.add("overThousandStars")
                starsRepo.closest(".repoContianer").classList.remove("overHuderedStars")
            }
            stars.push(repo.stargazers_count)
            starscont.push(starsRepo)
        })
        }
        }}
})

// move between the last and the next repositry in input filed
let d=1
input.onkeydown=function(e){
    if (e.keyCode == '37') {
    e.preventDefault()
       // left arrow


        if(inputsArray.length>=0){
            let range=inputsArray.length-d-1;
        input.value=inputsArray[range];
        if(input.value==="undefined"){
            input.value=null;
            return false;
        }
            d+=1;
        }
    }else if (e.keyCode == '39') {
    e.preventDefault()

       // right arrow
        if(inputsArray.length>=0){
        let range=inputsArray.length-d+1;
        input.value=inputsArray[range];
        if(input.value==="undefined"){
            input.value=null;
            return false;
        }
            d-=1;
        }
    }
}

// add star to the max repo in stars

let hh=[]
    btnGetRepo.addEventListener("click",function(e){
    setTimeout(function(){
        let valuescontstars = Object.values(starscont);
        let valuesstars = Object.values(stars);
        let maxStars=Math.max(...valuesstars)
        valuescontstars.forEach(function(e){
            if(maxStars===+e.innerHTML.slice(6) && maxStars !==0 ){
                hh.push(e)
                let hhArray=Object.values(hh)
                let iconStar=document.createElement("i");
                iconStar.classList.add("fa-solid")
                iconStar.classList.add("fa-star")
                iconStar.classList.add("iconStar")
                for(let h of hhArray){
                    h.appendChild(iconStar)
                }
            }
        })
    },1500)
    stars.length=0;
    starscont.length=0;
})




