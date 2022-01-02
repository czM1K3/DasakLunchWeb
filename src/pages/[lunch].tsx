import { GetServerSideProps } from "next";
import React, { FC } from "react";
import { Lunch } from "../types/lunch";
import { Review } from "../types/review";
import { supabase } from "../utils/supabase";

type LunchProps = {
	lunch: Lunch;
	reviews: Review[];
};

const Lunch: FC<LunchProps> = ({ reviews, lunch }) => {
	return (
		<div>
			<h1>{lunch.name}</h1>
			<div>
				{reviews.map(review => (
					<div key={review.id}>
						<h2>
							{review.content}
						</h2>
						<img src={review.image_url} />
					</div>
				))}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<LunchProps> = async ({ query }) => {
	const { lunch } = query;
	if (typeof(lunch) !== "string") return { notFound: true };
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
