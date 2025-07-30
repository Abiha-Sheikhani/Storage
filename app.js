const supabaseUrl = "https://ewvbudyibudldcmyiwtx.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dmJ1ZHlpYnVkbGRjbXlpd3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzkyMzIsImV4cCI6MjA2NzIxNTIzMn0.w96hQQjcGsQYUa91qe3MTntyqfFBAWqadxNEDsB9GVc"


const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey)
console.log(createClient)
// console.log(client);


// const path = window.location.pathname;

// if (
//   !path.includes("index.html") &&
//   !path.includes("login.html") 
// ) {
//   window.location.href = "/index.html";
// }

//  signup code
let signupBtn = document.getElementById('signUp-btn')
let google = document.getElementById('google')
signupBtn &&
  signupBtn.addEventListener('click', async () => {
    let username = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    if (username === "" && email === "" && password === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill all the fields first!",
      });
    }

    const { data, error } = await client.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    })
    console.log(data);


    if (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
      });
    }
    else {
      Swal.fire({
        icon: "success",
        title: "Account created!",
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        window.location.href = 'post.html';
      }, 1500)

    }

  })
google &&
  google.addEventListener('click', async () => {
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/post.html',
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  })

// eye toggle

let eye = document.getElementById('toggle-password')
eye &&
  eye.addEventListener('click', () => {
    eye.classList.toggle('disappear')
    if (eye.classList.contains('disappear')) {
      password.type = "text"
      eye.innerText = "visibility"
    }
    else {
      eye.innerHTML = "visibility_off"
      password.type = "password"
    }
  })


// login code

let loginBtn = document.getElementById('login-btn')
let email = document.getElementById('email')
let password = document.getElementById('password')
loginBtn &&
  loginBtn.addEventListener('click', async () => {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let timerInterval;

    if (email === "" && password === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill all the fields first!"
      });
    }

    const { data, error } = await client.auth.signInWithPassword({
      email: email,
      password: password,
    })
    console.log(data);


    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
    else {
      Swal.fire({
        icon: "success",
        title: "Login Successfully!",
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        window.location.href = 'post.html';
      }, 1500)



    }

  })


// post functionality


const post_button = document.getElementById('post-btn')
post_button &&
  post_button.addEventListener('click', async () => {
    let post_title = document.getElementById('title').value
    let post_description = document.getElementById('description').value
    const { data: { user } } = await client.auth.getUser()
    console.log(user);
    if (post_title === "" && post_description === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill all the fields first!",
      });
    }

    const { data, error } = await client
      .from('Posts')
      .insert({
        user_id: user.id,
        Title: post_title,
        Description: post_description
      })
    if (error || null) {
      Swal.fire({
        icon: "error",
        title: "Post cannot be posted.",
        text: error.message,
      });
    }
    else {
      // console.log(data);

      Swal.fire({
        icon: "success",
        title: "Post created successfully!",
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.href = 'all-posts.html';
      }, 1500)
    }
    document.getElementById('title').value = ""
    document.getElementById('description').value = ""


  })




if (window.location.pathname.includes("all-posts.html")) {
  const readAllPosts = async () => {
    const { data: fetchData, error: fetchError } = await client
      .from('Posts')
      .select();

    if (fetchData) {
      console.log(fetchData);
      const container = document.getElementById("container")
      container.innerHTML =
        fetchData.map(
          ({ user_id, Title, Description }) =>
            `
      <div class="card m-3 " style="width: 18rem;" id ="${user_id}">
  <div class="card-body">
    <h3 class="card-title">${Title}</h3>
    <p class="card-text">${Description}</p>
  </div>
</div>
      `
        ).join("")
    }
    else {
      console.error(fetchError.message);
    }
  };

  readAllPosts();
}



// read my posts


const readMyPost = async () => {
  const { data: { user } } = await client.auth.getUser()
  const { data, error } = await client
    .from('Posts')
    .select().eq('user_id', user.id)
  console.log(data);


  if (data) {
    const container = document.getElementById("container")
    container.innerHTML =
      data.map(
        ({ user_id, Title, Description, UID }) =>
          `
      <div class="card m-3 " style="width: 18rem;" id ="${user_id}">
  <div class="card-body">
    <h3 class="card-title">${Title}</h3>
    <p class="card-text">${Description}</p>
						<button type="button" onclick="editPost('${UID}','${Title}','${Description}')" class="btn btn-success">Edit</button>
						<button type="button" onclick="deletePost('${UID}')"  class="btn btn-danger">Delete</button></div>
					
  </div>
  
</div>
      `
      ).join("")


  }
  else {
    console.error(error.message);
  }


}


if (window.location.pathname === '/my-posts.html') {
  readMyPost()
}

// deleting post
async function deletePost(postId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {

          const response = await client.from('Posts').delete().eq('UID', postId);
          if (response) {

            console.log(response);
            readMyPost();
          } else {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }

        swalWithBootstrapButtons.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      } else if (

        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
        });
      }
    });

}

// edit post

async function editPost(postID2, post_title, post_description) {

  const { value: formValues } = await Swal.fire({
    title: "Edit Post",
    html: `
    <input id="swal-input1" class="swal2-input" placeholder="Enter Title" value="${post_title}">
    <textarea id="swal-input2" class="swal2-input" placeholder="Enter Description" >${post_description}</textarea>
  `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value
      ];
    }
  });
  if (formValues) {
    Swal.fire(JSON.stringify(formValues));
  }
  if (formValues) {
    const [editedTitle, editedDescription] = formValues
    const { error } = await client
      .from('Posts')
      .update({ Title: editedTitle, Description: editedDescription })
      .eq('UID', postID2)
    console.log(error);

  }

}


// logout function
logoutBtn = document.getElementById('logoutBtn');

logoutBtn &&
  logoutBtn.addEventListener('click', async () => {

    const { error } = await client.auth.signOut()
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed.",
        text: error.message,
      });

    }
    else {

      window.location.href = '/index.html'

    }

  })

 const gettingUser =  async()=>{
const { data } = await client.auth.getUser()
console.log(data);
}

gettingUser()