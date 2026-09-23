const API_URL=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
export const getToken=()=>localStorage.getItem("skilltrack_token");
export const setSession=d=>{localStorage.setItem("skilltrack_token",d.token);localStorage.setItem("skilltrack_user",JSON.stringify(d.user));};
export const clearSession=()=>{localStorage.removeItem("skilltrack_token");localStorage.removeItem("skilltrack_user");};
export async function api(path,options={}){const headers={"Content-Type":"application/json",...(options.headers||{})};const t=getToken();if(t)headers.Authorization=`Bearer ${t}`;const r=await fetch(`${API_URL}${path}`,{...options,headers});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||"Request failed.");return d;}
export const authApi={register:b=>api("/auth/register",{method:"POST",body:JSON.stringify(b)}),login:b=>api("/auth/login",{method:"POST",body:JSON.stringify(b)}),me:()=>api("/auth/me")};
export const courseApi={list:p=>{const q=new URLSearchParams(Object.entries(p||{}).filter(([,v])=>v&&v!=="All"));return api(`/courses?${q}`)},get:id=>api(`/courses/${id}`),create:b=>api("/courses",{method:"POST",body:JSON.stringify(b)}),update:(id,b)=>api(`/courses/${id}`,{method:"PUT",body:JSON.stringify(b)}),remove:id=>api(`/courses/${id}`,{method:"DELETE"})};
export const learningApi={my:()=>api("/enrollments/my"),enrol:courseId=>api("/enrollments",{method:"POST",body:JSON.stringify({courseId})}),progress:(courseId,lesson)=>api(`/enrollments/${courseId}/progress`,{method:"PUT",body:JSON.stringify({lesson})}),dashboard:()=>api("/dashboard")};
export const quizApi={get:()=>api("/quiz"),submit:answers=>api("/quiz/submit",{method:"POST",body:JSON.stringify({answers})}),results:()=>api("/quiz/results")};
