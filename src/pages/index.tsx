import { GetServerSideProps } from 'next'
import { FC } from 'react'
import { Lunch } from '../types/lunch'
import { supabase } from '../utils/supabase'
import Link from "next/link";

type HomeProps = {
  lunches: Lunch[] | null;
};

const Home: FC<HomeProps> = ({ lunches }) => {
  if (!lunches) return <div>Something went wrong</div>;
  return (
    <ul>
      {lunches.sort((a, b) => {
        return a.name.localeCompare(b.name)
      }).map(lunch => (
        <li key={lunch.id}>
          <Link href={`/${lunch.id}`} passHref>
            {lunch.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const { body } = await supabase.from<Lunch>("lunches").select();
  return {
    props: {
      lunches: body,
    },
  };
};

export default Home;
