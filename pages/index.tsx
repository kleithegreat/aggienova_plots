import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { supabase } from '../lib/supabase';
import { Supernova, Filter, SupernovaType } from '../types';
import Layout from '../components/Layout';
import SupernovaeSelection from '../components/SupernovaeSelection';
import ColorSelection from '../components/ColorSelection';
import PlotDiv from '../components/PlotDiv';

interface Props {
  supernovae: Supernova[];
  filters: Filter[];
  supernovaTypes: SupernovaType[];
}

const Home: React.FC<Props> = ({ supernovae, filters, supernovaTypes }) => {
  const [selectedSupernovae, setSelectedSupernovae] = useState<Supernova[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  return (
    <Layout>
      <h1>Supernovae Light Curves</h1>
      <SupernovaeSelection
        supernovae={supernovae}
        supernovaTypes={supernovaTypes}
        selectedSupernovae={selectedSupernovae}
        setSelectedSupernovae={setSelectedSupernovae}
      />
      <ColorSelection
        filters={filters}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <PlotDiv
        selectedSupernovae={selectedSupernovae}
        selectedFilters={selectedFilters}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: supernovae, error: supernovaeError } = await supabase
    .from<string, Supernova>('supernovae')
    .select('*');

  const { data: filters, error: filtersError } = await supabase
    .from<string, Filter>('filters')
    .select('*');

  const { data: supernovaTypes, error: typesError } = await supabase
    .from<string, SupernovaType>('sn_types')
    .select('*');

  if (supernovaeError || filtersError || typesError) {
    console.error('Error fetching data:', supernovaeError || filtersError || typesError);
    return {
      props: {
        supernovae: [],
        filters: [],
        supernovaTypes: [],
      },
    };
  }

  return {
    props: {
      supernovae: supernovae || [],
      filters: filters || [],
      supernovaTypes: supernovaTypes || [],
    },
  };
};

export default Home;