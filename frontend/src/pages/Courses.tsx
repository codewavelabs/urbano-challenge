import { useEffect, useState } from 'react';
import { Loader, Plus, RefreshCcw, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import Course from '../models/course/Course';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      setData(
        await courseService.findAll({
          name: name || undefined,
          description: description || undefined,
        }),
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      fetchData();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Courses</h1>
      <hr />
      <div className="flex">
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Add Course
          </button>
        ) : null}
        <button
          className="ml-2 btn my-5 flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => fetchData()}
        >
          <RefreshCcw /> Refresh
        </button>
      </div>

      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <CoursesTable data={data} isLoading={loading} />

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
