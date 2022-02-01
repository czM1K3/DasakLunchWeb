import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { FC, useMemo } from "react";
import { Lunch } from "../types/lunch";
import { Review } from "../types/review";
import { supabase } from "../utils/supabase";

type LunchProps = {
	lunch: Lunch;
	reviews: Review[];
};

const Lunch: FC<LunchProps> = ({ reviews, lunch }) => {
	const title = useMemo(() => lunch.name.charAt(0).toUpperCase() + lunch.name.slice(1), [lunch]);
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<Link href="/" passHref>
				<a>
					<button>Zpět</button>
				</a>
			</Link>
			<h1>{title}</h1>
			<div>
				{reviews.map((review, i) => (
					<figure key={review.id}>
						<img src={review.image_url} alt={`image-${i}`} />
						<figcaption>{review.content}</figcaption>
					</figure>
				))}
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<LunchProps> = async ({ query }) => {
	const { lunch } = query;
	if (typeof (lunch) !== "string") return { notFound: true };
	const num = parseInt(lunch);
	if (!num) return { notFound: true };

	const lunchRes = await supabase.from<Lunch>("lunches").select().eq("id", num);
	if (!lunchRes.body || lunchRes.body.length !== 1) return { notFound: true };
	const reviewesRes = await supabase.from<Review>("reviews").select().eq("lunch_id", lunch);
	return {
		props: {
			lunch: {
				id: lunchRes.body[0].id,
				name: lunchRes.body[0].name,
			},
			reviews: reviewesRes.body ?? [],
		},
	};
};

export default Lunch;
