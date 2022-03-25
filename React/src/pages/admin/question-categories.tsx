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
import { IQuestionCategory } from "../../interfaces/IQuestionCategory";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import useDevice from "../../hooks/useDevice";


const GET_QUESTION_CATEGORIES = gql`
query {
	questionCategories {
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
const CREATE_QUESTION_CATEGORY = gql`
mutation ($questionCategory: QuestionCategoryCreateInput!) {
	createQuestionCategory(questionCategory: $questionCategory) {
		_id
	}
}
`;
const UPDATE_QUESTION_CATEGORY = gql`
mutation ($questionCategoryInput: QuestionCategoryModifyInput!) {
	updateQuestionCategory(questionCategoryInput: $questionCategoryInput) {
		_id
	}
}
`;
const DELETE_QUESTION_CATEGORY = gql`
mutation ($_id: String!) {
	deleteQuestionCategory(_id: $_id)
}
`;

const defaultValues: Partial<IQuestionCategory> = {
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

const QuestionCategories = () => {
	const toast = useToast();
	const { adminModalState, setAdminModalState } = useContext(AdminContext);
	const { data, loading, refetch } = useQuery(GET_QUESTION_CATEGORIES);
	const [createFunction] = useMutation(CREATE_QUESTION_CATEGORY);
	const [updateFunction] = useMutation(UPDATE_QUESTION_CATEGORY);
	const [deleteFunction] = useMutation(DELETE_QUESTION_CATEGORY);
	const device = useDevice();
	const [sortType, setSortType] = useState("questionCategory");
	const [sortOrder, setSortOrder] = useState(true);

	const getQuestionCategories = (questionCategoriesArray: IQuestionCategory[]) => {
		if (!questionCategoriesArray) {
			return [];
		}
		return [...questionCategoriesArray].sort((a, b) => a.name.localeCompare(b.name));
	}
	const [questionCategories, setQuestionCategories] = useState<IQuestionCategory[]>(getQuestionCategories(data?.questionCategories));

	useEffect(() => {
		setQuestionCategories(getQuestionCategories(data?.questionCategories));
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
			setQuestionCategories([...questionCategories].sort((a, b) => sort(a, b)));
		}
		else {
			setQuestionCategories([...questionCategories].sort((a, b) => sort(b, a)));
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
	const openQuestionModal = (
		action: "edit" | "delete",
		questionCategory: IQuestionCategory,
	) => {
		setAdminModalState(action);
		reset({
			_id: questionCategory?._id,
			auditType: questionCategory?.auditType,
			name: questionCategory?.name,
			withAnswers: questionCategory?.withAnswers,
			allowCustomQuestions: questionCategory?.allowCustomQuestions,
			maxQuestionsNumber: questionCategory?.maxQuestionsNumber,
			scope: questionCategory?.scope,
		});
	};

	const handleAddQuestionCategory = async () => {
		try {
			if (Object.keys(errors).length === 0) {
				const questionCategory = getValues();
				await createFunction({ variables: { questionCategory } });
				refetch();
				toast({ ...toastSuccess, description: "Question category added" });
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

	const handleUpdateQuestionCategory = async () => {
		try {
			if (Object.keys(errors).length === 0) {
				const questionCategory = getValues();
				await updateFunction({
					variables: {
						questionCategoryInput: {
							_id: questionCategory?._id,
							auditType: questionCategory?.auditType,
							name: questionCategory?.name,
							withAnswers: questionCategory?.withAnswers,
							allowCustomQuestions: questionCategory?.allowCustomQuestions,
							maxQuestionsNumber: questionCategory?.maxQuestionsNumber,
						},
					},
				});
				refetch();
				toast({ ...toastSuccess, description: "Question category updated" });
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

	const handleDeleteQuestionCategory = async () => {
		try {
			const _id = getValues('_id');
			await deleteFunction({ variables: { _id } });
			refetch();
			toast({ ...toastSuccess, description: "Question category deleted" });
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
				handleAddQuestionCategory();
				break;
			case "edit":
				handleUpdateQuestionCategory();
				break;
			case "delete":
				handleDeleteQuestionCategory();
				break;
			default:
				setAdminModalState("closed");
		}
	};

	const renderQuestionCategoryRow = (questionCategory: IQuestionCategory, i: number) => (
		<Flex
			key={questionCategory._id}
			w='full'
			h='73px'
			bg='#FFFFFF'
			mb="1px"
			p={4}
			alignItems='center'
			borderBottomRadius={(i === questionCategories.length - 1) ? 'lg' : ''}
			boxShadow="sm"
			flexShrink={0}
		>
			<Flex
				w='full'
				flexDir="column"
				pl={1}
				mr={4}
				cursor="pointer"
				onClick={() => openQuestionModal('edit', questionCategory)}
			>
				<Text
					overflow='hidden'
					textOverflow='ellipsis'
					whiteSpace='nowrap'
				>{questionCategory.name}
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
				collection={"questions"}
			>
				<Stack w={device === 'mobile' ? 'full' : "calc(100% - 150px)"} spacing={2}>
					<TextInput
						name="name"
						label="Name"
						placeholder='Name'
						control={control}
						required={true}
						validations={{
							notEmpty: true,
						}}
					/>
					<TextInput
						name="auditType"
						label="Audit Type"
						placeholder='Audit Type'
						control={control}
					/>
					<Toggle
						name="withAnswers"
						label="Allow answers"
						placeholder='Allow answers'
						control={control}
						required={true}
					/>
					<Toggle
						name="allowCustomQuestions"
						label="Allow custom questions"
						placeholder='Allow custom questions'
						control={control}
						required={true}
					/>
					<NumberInput
						name="maxQuestionsNumber"
						label="Max number of questions"
						placeholder='Max number of questions'
						control={control}
						required={true}
						validations={{
							notEmpty: true,
						}}
					/>
				</Stack>
			</AdminModal>
			<Header breadcrumbs={["Admin", "Question Categories"]} mobileBreadcrumbs={["Question Categories"]} />
			<Flex h='calc(100vh - 160px)' px={["25px", 0]} overflow="auto">
				<Box w='full' h={['calc(100% - 90px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
					<AdminTableHeader>
						<AdminTableHeaderElement w='full' label="Question Categories" onClick={() => { setSortType("questionCategory"); setSortOrder(!sortOrder); }} sortOrder={sortType === "questionCategory" && !sortOrder} showSortingIcon={sortType === "questionCategory"} />
					</AdminTableHeader>
					<Flex h="full" bg="white" flexDir="column" overflow="auto" w='full' borderBottomRadius="20px" fontSize="smm">
						{loading ? <Loader center={true} /> : (questionCategories?.length > 0 ? questionCategories?.map(renderQuestionCategoryRow) : (
							<Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
								No question categories found
							</Flex>
						))}
					</Flex>
				</Box>
			</Flex>
		</>
	);
};

export default QuestionCategories;
