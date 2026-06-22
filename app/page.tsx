import { supabase } from "@/lib/supabase/client"

export default async function Home() {
  const { data } = await supabase.from("test").select("*")

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
