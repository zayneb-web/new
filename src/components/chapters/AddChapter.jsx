import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import TextInput from '../../components/TextInput';
import CustomButton from '../../components/CustomButton';
import { addChapter } from '../../redux/chapterSlice';
import { uploadImage, apiRequest } from '../../utils/api';
import Loading from '../../components/Loading';
import { BiImages } from 'react-icons/bi';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const AddChapterForm = ({ onClose }) => {
  const [errMsg, setErrMsg] = useState('');
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([{ titre: '', options: [{ option: '', isCorrect: false }] }]);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const handleSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const uri = file && (await uploadImage(file));
      const newData = { ...data, chapterImage: uri, questions }; // Include questions in data
      const res = await apiRequest({
        url: '/chapter/addchapter',
        data: newData,
        token: user?.token,
        method: 'POST',
      });
      console.log('Response from API:', res); // Log the response from the API
      if (res?.status === 'success') {
        // If chapter is successfully created
        setErrMsg(''); // Clear any previous error message
        console.log('Chapter created successfully:', res.message); // Log success message in console
        // You can also show a success message on the UI
        alert('Chapter created successfully'); // Display a success message
        onClose(); // Close the form after successful creation
      } else if (res?.status === 'failed') {
        setErrMsg(res.message);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const formRef = useRef(null);
  useOutsideClick(formRef, onClose);

  const addQuestion = () => {
    setQuestions([...questions, { titre: '', options: [{ option: '', isCorrect: false }] }]);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ option: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].option = value;
    setQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = !updatedQuestions[questionIndex].options[optionIndex].isCorrect;
    setQuestions(updatedQuestions);
  };

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-[#000] opacity-70'></div>
        </div>

        <div
          ref={formRef}
          className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <div className='flex justify-between px-6 pt-5 pb-2'>
            <label
              htmlFor='name'
              className='block font-medium text-xl text-ascent-1 text-left'
            >
              Add Chapter
            </label>
          </div>
          <form
            className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="chapterName"
              label="Chapter Name"
              placeholder="Chapter Name"
              type="text"
              register={register("chapterName", {
                required: "Chapter Name is required!",
              })}
              error={errors.chapterName ? errors.chapterName?.message : ""}
            />

            <TextInput
              name="chapterDescription"
              label="Chapter Description"
              placeholder="Chapter Description"
              type="text"
              register={register("chapterDescription", {
                required: "Chapter Description is required!",
              })}
              error={errors.chapterDescription ? errors.chapterDescription?.message : ""}
            />

            <TextInput
              name="tag"
              label="Tag"
              placeholder="Tag"
              type="text"
              register={register("tag", {
                required: "Tag is required!",
              })}
              error={errors.tag ? errors.tag?.message : ""}
            />

            <label
              className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
              htmlFor='imgUpload'
            >
              <BiImages />
              <input
                type='file'
                className=''
                id='imgUpload'
                onChange={handleSelect}
                accept='.jpg, .png, .jpeg'
              />
            </label>

            {errMsg && (
              <span className='text-sm text-red-500 mt-2'>{errMsg}</span>
            )}

            {questions.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                {/* Titre des questions */}
                <TextInput
                  name={`questions[${index}].titre`}
                  label="Question Title"
                  placeholder="Question Title"
                  type="text"
                  value={question.titre}
                  onChange={(e) => handleQuestionChange(index, 'titre', e.target.value)}
                  error={errors.questions && errors.questions[index] ? errors.questions[index].titre?.message : ""}
                />
                
                {/* Input pour ajouter des options à la question */}
                <div className="flex flex-col gap-1">
                  <label htmlFor={`options-${index}`} className="text-base text-ascent-2">
                    Options
                  </label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-1">
                      <input
                        type="text"
                        id={`options-${index}`}
                        value={option.option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        placeholder="Option"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                      {/* Icone check pour marquer les options de question correctes */}
                      <span className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() => handleCheckboxChange(index, optionIndex)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label
                          htmlFor={`correctOption-${index}-${optionIndex}`}
                          className="text-base text-ascent-2"
                        >
                          Correct Option
                        </label>
                      </span>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(index)}>Add Option</button>
                </div>
              </div>
            ))}

            {isSubmitting ? (
              <Loading />
            ) : (
              <>
                <CustomButton
                  type='submit'
                  containerStyles={`inline-flex justify-center mb-5 rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title='Add Chapter'
                />
                <button type="button" onClick={addQuestion}>Add Question</button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChapterForm;
