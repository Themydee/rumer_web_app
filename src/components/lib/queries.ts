import { gql } from "@apollo/client";

export const GET_SolutionImages_POSTS = gql`
	query GetPosts {
		solutionImages {
			edges {
				node {
					id
					databaseId
					title
					productImageContent {
						solutionType
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
export const GET_Faqs_POSTS = gql`
	query GetFaqsPosts {
		faqs {
			nodes {
				id
				databaseId
				title
				content
			}
		}
	}
`;

export const GET_Testimonials_POSTS = gql`
	query GetTestimonialPosts {
		testimonials {
			nodes {
				id
				databaseId
				testimonials {
					companyName
					content
					location
					name
					image {
						node {
							sourceUrl(size: LARGE)
							altText
							mediaDetails {
								sizes {
									name
									sourceUrl
									width
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_Why_Rumer_Work = gql`
	query GetWhyRumerWorksPost {
		post(id: "why-rumer-works-3", idType: URI) {
			id
			databaseId
			title
			content
			excerpt
			date
			modified
			whyRumerWorks {
				image {
					node {
						sourceUrl(size: LARGE)
						altText
						mediaDetails {
							sizes {
								name
								sourceUrl
								width
								height
							}
						}
					}
				}
				points1 {
					description
					title
				}
				points2 {
					description
					title
				}
				points3 {
					description
					title
				}
				points4 {
					description
					title
				}
				points5 {
					description
					title
				}
			}
		}
	}
`;

export const GET_INTRODUCINGRUMER_POST = gql`
	query GetPost {
		feRumerContent(id: 97, idType: DATABASE_ID) {
			id
			title
			introducingRumer {
				description
				tagName
				title
				titleBrea
				leftCard {
					cardTag
					description
					title
				}
				rightCard {
					logoImage {
						node {
							sourceUrl(size: LARGE)
							altText
							mediaDetails {
								sizes {
									name
									sourceUrl
									width
								}
							}
						}
					}
					boxOne {
						title
						logo1 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						logo2 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					boxTwo {
						title
						logo1 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						logo2 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					boxThree {
						title
						logo1 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						logo2 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						logo3 {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_whatMakesRumerDiffer_POST = gql`
	query GetPost {
		feRumerContent(id: 125, idType: DATABASE_ID) {
			id
			title
			whatMakesRumerDiffer {
				description
				title
				points {
					pointOne
					pointThree
					pointTwo
				}
				joinEarlyAccess {
					title
					url
				}
				listGroup {
					listOne {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					listTwo {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					listThree {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					listFour {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					listFive {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
					listSix {
						title
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_joinTheRumerEarly_POST = gql`
	query GetPost {
		feRumerContent(id: 164, idType: DATABASE_ID) {
			id
			title
			joinTheRumerEarly {
				description
				tag
				title
				points {
					pointOne
					pointThree
					pointTwo
				}
				applyForEarlyAccess {
					title
					url
				}
				rightGroup {
					upCardGroup {
						amount
						rate
						rateAmount
					}
					downCard {
						amount
						tag
					}
					icons {
						iconOne {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						iconTwo {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						iconThree {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						iconFour {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_frontViewComponent_POST = gql`
	query GetPost {
		feRumerContent(id: 187, idType: DATABASE_ID) {
			id
			title
			frontViewComponent {
				leftSection {
					description
					tag
					titleBreaks {
						four
						one
						three
						two
					}
					joinEarlyAccessButton {
						title
						url
					}
				}
				rightSide {
					imageViewOne {
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
						tag {
							name
							icon {
								node {
									sourceUrl(size: LARGE)
									altText
									mediaDetails {
										sizes {
											name
											sourceUrl
											width
										}
									}
								}
							}
						}
					}
					imageViewTwo {
						tag
						image {
							node {
								sourceUrl(size: LARGE)
								altText
								mediaDetails {
									sizes {
										name
										sourceUrl
										width
									}
								}
							}
						}
					}
				}
				additonalCard {
					name
					title
					amount
					dateAndCategory
					image {
						node {
							sourceUrl(size: LARGE)
							altText
							mediaDetails {
								sizes {
									name
									sourceUrl
									width
								}
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_ProductContent_POST = gql`
	query GetPost {
		feRumerContent(id: 219, idType: DATABASE_ID) {
			id
			databaseId
			productContent {
				title
				description
				join {
					title
					url
				}
				icon {
					node {
						sourceUrl(size: LARGE)
						altText
						mediaDetails {
							sizes {
								name
								sourceUrl
								width
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_SolutionBuyerContent_POST = gql`
	query GetPost {
		feRumerContent(id: 237, idType: DATABASE_ID) {
			id
			databaseId
			productContent {
				title
				description
				join {
					title
					url
				}
				icon {
					node {
						sourceUrl(size: LARGE)
						altText
						mediaDetails {
							sizes {
								name
								sourceUrl
								width
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_SolutionProcessorContent_POST = gql`
	query GetPost {
		feRumerContent(id: 238, idType: DATABASE_ID) {
			id
			databaseId
			productContent {
				title
				description
				join {
					title
					url
				}
				icon {
					node {
						sourceUrl(size: LARGE)
						altText
						mediaDetails {
							sizes {
								name
								sourceUrl
								width
							}
						}
					}
				}
			}
		}
	}
`;

export const GET_FinancialContent_POST = gql`
	query GetPost {
		feRumerContent(id: 239, idType: DATABASE_ID) {
			id
			databaseId
			productContent {
				title
				description
				join {
					title
					url
				}
				icon {
					node {
						sourceUrl(size: LARGE)
						altText
						mediaDetails {
							sizes {
								name
								sourceUrl
								width
							}
						}
					}
				}
			}
		}
	}
`;
