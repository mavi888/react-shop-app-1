import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { confirmNewUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useDispatch } from "react-redux";
const { Title } = Typography;


function ConfirmNewUserPage(props) {
    const dispatch = useDispatch();

    const [formErrorMessage, setFormErrorMessage] = useState('')


    return (
<div className="form">
      <Formik
        initialValues={{
          email: '',
          code: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
          code: Yup.string()
            .min(6, 'Code is 6 characters')
            .max(6, 'Code is 6 characters')
            .required('Code is required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            let dataToSubmit = {
              email: values.email,
              code: values.code
            };

            dispatch(confirmNewUser(dataToSubmit))
              .then(response => {
                console.log(response)
                if (response.payload.success) {
                    props.history.push("/login");
                } else {
                    alert('Confirmation was not successfull')
                }
              })
            setSubmitting(false);
          }, 500);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          } = props;
          return (
            <div className="app">

              <Title level={2}>Confirm user</Title>
              <form onSubmit={handleSubmit} style={{ width: '350px' }}>

                <Form.Item required>
                  <Input
                    id="email"
                    prefix={<UserOutlined/>}
                    placeholder="Enter your email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="code"
                    prefix={<LockOutlined/>}
                    placeholder="Enter the verification code"
                    type="text"
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.code && touched.code ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.code && touched.code && (
                    <div className="input-feedback">{errors.code}</div>
                  )}
                </Form.Item>

                {formErrorMessage && (
                  <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                )}

                <Form.Item>
                  <div>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                      Confirm user 
                  </Button>
                  </div>
                  Or <a href="/register">register now!</a>
                </Form.Item>
              </form>
            </div>
          );
        }}
      </Formik>
    </div>
    );
};

export default withRouter(ConfirmNewUserPage);