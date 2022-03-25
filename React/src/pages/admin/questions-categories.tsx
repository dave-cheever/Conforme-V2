import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, useToast, Stack } from "@chakra-ui/react";

import Loader from "../../components/Loader";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import { AdminContext } from "../../contexts/AdminProvider";
import NumberInput from "../../components/Forms/NumberInput";
import Toggle from "../../components/Forms/Toggle";
import TextInput from "../../components/Forms/TextInput";
import Header from "../../components/Header";
import { IQuestionsCategory } from "../../interfaces/IQuestionsCategory";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import useDevice from "../../hooks/useDevice";


const GET_QUESTIONS_CATEGORIES = gql`
query {
	questionsCategories {
		_id
		auditType
		name
		withAnswers
		allowCustomQuestions
		maxQuestionsNumber
		scope {
			component
		}
	}
}
`;
const CREATE_QUESTIONS_CATEGORY = gql`
mutation ($questionsCategory: QuestionsCategoryCreateInput!) {
	createQuestionsCategory(questionsCategory: $questionsCategory) {
		_id
	}
}
`;
const UPDATE_QUESTIONS_CATEGORY = gql`
mutation ($questionsCategoryInput: QuestionsCategoryModifyInput!) {
	updateQuestionsCategory(questionsCategoryInput: $questionsCategoryInput) {
		_id
	}
}
`;
const DELETE_QUESTION_CATEGORY = gql`
mutation ($_id: String!) {
	deleteQuestionsCategory(_id: $_id)
}
`;

const defaultValues: Partial<IQuestionsCategory> = {
	_id: undefined,
	auditType: "",
	name: "",
	withAnswers: true,
	allowCustomQuestions: true,
	maxQuestionsNumber: 5,
	scope: {
		component: 'audits',
	}
};

const QuestionsCategories = () => {
	const toast = useToast();
	const { adminModalState, setAdminModalState } = useContext(AdminContext);
	const { data, loading, refetch } = useQuery(GET_QUESTIONS_CATEGORIES);
	const [createFunction] = useMutation(CREATE_QUESTIONS_CATEGORY);
	const [updateFunction] = useMutation(UPDATE_QUESTIONS_CATEGORY);
	const [deleteFunction] = useMutation(DELETE_QUESTION_CATEGORY);
	const device = useDevice();
	const [sortType, setSortType] = useState("questionsCategory");
	const [sortOrder, setSortOrder] = useState(true);

	const getQuestionsCategories = (questionsCategoriesArray: IQuestionsCategory[]) => {
		if (!questionsCategoriesArray) {
			return [];
		}
		return [...questionsCategoriesArray].sort((a, b) => a.name.localeCompare(b.name));
	}
	const [questionsCategories, setQuestionsCategories] = useState<IQuestionsCategory[]>(getQuestionsCategories(data?.questionsCategories));

	useEffect(() => {
		setQuestionsCategories(getQuestionsCategories(data?.questionsCategories));
	}, [data]);

	useEffect(() => {
		const sort = (a, b) => {
			if (sortType === 'owner')
				return (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');
			else {
				return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());
			}
		};
		if (sortOrder) {
			setQuestionsCategories([...questionsCategories].sort((a, b) => sort(a, b)));
		}
		else {
			setQuestionsCategories([...questionsCategories].sort((a, b) => sort(b, a)));
		}
	}, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

	const {
		control,
		formState: { errors },
		getValues,
		trigger,
		reset,
	} = useForm({
		mode: "all",
		defaultValues,
	});

	// Reset the form after closing
	useEffect(() => {
		if (adminModalState === "closed") {
			reset(defaultValues);
		}
	}, [reset, adminModalState]);

	// If modal opened in edit or delete mode, reset the form and set values of edited element
	const openQuestionsCategoryModal = (
		action: "edit" | "delete",
		questionsCategory: IQuestionsCategory,
	) => {
		setAdminModalState(action);
		reset({
			_id: questionsCategory?._id,
			auditType: questionsCategory?.auditType,
			name: questionsCategory?.name,
			withAnswers: questionsCategory?.withAnswers,
			allowCustomQuestions: questionsCategory?.allowCustomQuestions,
			maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
			scope: questionsCategory?.scope,
		});
	};

	const handleAddQuestionsCategory = async () => {
		try {
			if (Object.keys(errors).length === 0) {
				const questionsCategory = getValues();
				await createFunction({ variables: { questionsCategory } });
				refetch();
				toast({ ...toastSuccess, description: "Questions category added" });
			} else {
				toast({
					...toastFailed,
					description: "Please complete all the required fields",
				});
			}
		} catch (e: any) {
			toast({ ...toastFailed, description: e.message });
		} finally {
			setAdminModalState("closed");
		}
	};

	const handleUpdateQuestionsCategory = async () => {
		try {
			if (Object.keys(errors).length === 0) {
				const questionsCategory = getValues();
				await updateFunction({
					variables: {
						questionsCategoryInput: {
							_id: questionsCategory?._id,
							auditType: questionsCategory?.auditType,
							name: questionsCategory?.name,
							withAnswers: questionsCategory?.withAnswers,
							allowCustomQuestions: questionsCategory?.allowCustomQuestions,
							maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
						},
					},
				});
				refetch();
				toast({ ...toastSuccess, description: "Questions category updated" });
			} else {
				toast({
					...toastFailed,
					description: "Please complete all the required fields",
				});
			}
		} catch (e: any) {
			toast({ ...toastFailed, description: e.message });
		} finally {
			setAdminModalState("closed");
		}
	};

	const handleDeleteQuestionsCategory = async () => {
		try {
			const _id = getValues('_id');
			await deleteFunction({ variables: { _id } });
			refetch();
			toast({ ...toastSuccess, description: "Questions category deleted" });
		} catch (e: any) {
			toast({ ...toastFailed, description: e.message });
		} finally {
			setAdminModalState("closed");
		}
	};

	const handleAction = async (action) => {
		const isFormValid = await trigger();
		if (["add", "edit"].includes(action) && !isFormValid) {
			return toast({
				...toastFailed,
				description: "Please complete all the required fields",
			});
		}
		switch (action) {
			case "add":
				handleAddQuestionsCategory();
				break;
			case "edit":
				handleUpdateQuestionsCategory();
				break;
			case "delete":
				handleDeleteQuestionsCategory();
				break;
			default:
				setAdminModalState("closed");
		}
	};

	const renderQuestionsCategoryRow = (questionsCategory: IQuestionsCategory, i: number) => (
		<Flex
			key={questionsCategory._id}
			w='full'
			h='73px'
			bg='#FFFFFF'
			mb="1px"
			p={4}
			alignItems='center'
			borderBottomRadius={(i === questionsCategories.length - 1) ? 'lg' : ''}
			boxShadow="sm"
			flexShrink={0}
		>
			<Flex
				w='full'
				flexDir="column"
				pl={1}
				mr={4}
				cursor="pointer"
				onClick={() => openQuestionsCategoryModal('edit', questionsCategory)}
			>
				<Text
					overflow='hidden'
					textOverflow='ellipsis'
					whiteSpace='nowrap'
				>{questionsCategory.name}
				</Text>
			</Flex>
		</Flex>
	);

	return (
		<>
			<AdminModal
				isOpenModal={adminModalState !== "closed"}
				modalType={adminModalState}
				onAction={handleAction}
				collection={"questions category"}
			>
				<Stack w={device === 'mobile' ? 'full' : "calc(100% - 150px)"} spacing={2}>
					<TextInput
						name="name"
						label="Name"
						placeholder='Name'
						control={control}
						validations={{
							notEmpty: true,
						}}
					/>
					<Toggle
						name="withAnswers"
						label="Allow answers"
						placeholder='Allow answers'
						control={control}
					/>
					<Toggle
						name="allowCustomQuestions"
						label="Allow custom questions"
						placeholder='Allow custom questions'
						control={control}
					/>
					<NumberInput
						name="maxQuestionsNumber"
						label="Max number of questions"
						placeholder='Max number of questions'
						control={control}
						validations={{
							notEmpty: true,
						}}
					/>
				</Stack>
			</AdminModal>
			<Header breadcrumbs={["Admin", "Questions categories"]} mobileBreadcrumbs={["Questions categories"]} />
			<Flex h='calc(100vh - 160px)' px={["25px", 0]} overflow="auto">
				<Box w='full' h={['calc(100% - 90px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
					<AdminTableHeader>
						<AdminTableHeaderElement w='full' label="Question Categories" onClick={() => { setSortType("questionCategory"); setSortOrder(!sortOrder); }} sortOrder={sortType === "questionCategory" && !sortOrder} showSortingIcon={sortType === "questionCategory"} />
					</AdminTableHeader>
					<Flex h="full" bg="white" flexDir="column" overflow="auto" w='full' borderBottomRadius="20px" fontSize="smm">
						{loading ? <Loader center={true} /> : (questionsCategories?.length > 0 ? questionsCategories?.map(renderQuestionsCategoryRow) : (
							<Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
								No questions categories found
							</Flex>
						))}
					</Flex>
				</Box>
			</Flex>
		</>
	);
};

export default QuestionsCategories;
