import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score } = req.body
    const { data, error } = await supabase
      .from('scores')
      .insert({ score })

    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ message: 'Score saved successfully', data })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}