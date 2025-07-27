const supabaseUrl = "https://ewvbudyibudldcmyiwtx.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dmJ1ZHlpYnVkbGRjbXlpd3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzkyMzIsImV4cCI6MjA2NzIxNTIzMn0.w96hQQjcGsQYUa91qe3MTntyqfFBAWqadxNEDsB9GVc"


const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey)
console.log(createClient)
console.log(client);




const post_button = document.getElementById('post-btn')

post_button.addEventListener('click', async()=>{
let post_title = document.getElementById('title').value
let post_description = document.getElementById('description').value
const { data : {user} } = await client.auth.getUser()
console.log(user);
if(post_title === "" && post_description === ""){
  Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please fill all the fields first!",
    });
}

const { data,error } = await client
  .from('Posts')
  .insert({ 
    user_id : user.id,
    Title : post_title,
    Description : post_description
   })
   if(error){
    Swal.fire({
      icon: "error",
      title: "Post cannot be posted.",
      text: error.message,
    });
   }
   else{
    console.log(data);
    
     Swal.fire({
      icon: "success",
      title: "Post created successfully!",
      showConfirmButton: false,
      timer: 1500
    })
  window.location.href = './all-posts.html'
   }
    document.getElementById('title').value = ""
   document.getElementById('description').value = ""
  })
 