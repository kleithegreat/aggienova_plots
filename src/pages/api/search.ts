// src/pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

const searchSupernovae = async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const { data, error } = await supabase
            .from('supernovae')
            .select('sn_id, sn_name')
            .ilike('sn_name', `%${query}%`);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error: unknown) {
        let errorMessage: string;
    
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = 'An unexpected error occurred';
        }
    
        res.status(500).json({ error: errorMessage });
    }
};

export default searchSupernovae;
