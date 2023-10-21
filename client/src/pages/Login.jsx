import styled from 'styled-components';
import { FormRow, Logo } from '../components';
import {
  Link,
  Form,
  redirect,
  useNavigation,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useState } from 'react';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    // useActionData check
    const errors = { msg: '' };
    if (data.password.length < 3) {
      errors.msg = 'password too short';
      return errors;
    }
    // end useActionData check
    try {
      await customFetch.post('/auth/login', data);
      queryClient.invalidateQueries();
      toast.success('Login successful');
      return redirect('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const Login = () => {
  // access errors object
  const errors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  // const [isReCAPTCHA, setIsReCAPTCHA] = useState(false);

  const navigate = useNavigate();

  // demo user
  const loginDemoUser = async () => {
    const data = {
      email: 'test@test.com',
      password: 'secret123',
    };
    try {
      await customFetch.post('/auth/login', data);
      toast.success('Take a test drive');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>login</h4>
        {errors?.msg ? <p className='errors'>{errors.msg}</p> : null}
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        <button
          type='submit'
          className='btn btn-block'
          disabled={isSubmitting}
          // disabled={isSubmitting || !isReCAPTCHA}
        >
          {isSubmitting ? 'submitting' : 'submit'}
        </button>
        <button
          type='button'
          className='btn btn-block re'
          onClick={loginDemoUser}
        >
          explore the app
        </button>
        {/* <ReCAPTCHA
          sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA}
          size='normal'
          hl='HE'
          onChange={() => setIsReCAPTCHA(true)}
        /> */}
        <p>
          Not a member yet?
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }
  h4 {
    text-align: center;
    margin-bottom: 1.38rem;
  }
  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    color: var(--primary-500);
    letter-spacing: var(--letter-spacing);
    margin-left: 0.25rem;
  }
  .errors {
    color: red;
    text-transform: capitalize;
  }
  /* .re {
    margin-bottom: 1rem;
  } */
`;

export default Login;
