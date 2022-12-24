import React, { useState, useEffect } from "react";
import {Button, Container, Grid, TextField, Typography, Link} from "@mui/material";
import { API_BASE_URL } from "../config/host-config";
import {Helmet} from "react-helmet";
import SignUp from "./SignUp";

import PopupDom from './PopupDom';
import PopupPostCode from './PopupPostCode';
 

import { isValidDateValue } from "@testing-library/user-event/dist/utils";

import DaumPostCode from 'react-daum-postcode';
import { CheckBox } from "@mui/icons-material";

const Join = () => {

     const [enroll_company, setEnroll_company] = useState({
        address:'',
    });
    
    const [popup, setPopup] = useState(false);

    // 회원 입력 정보 상태관리
    const [user, setUser] = useState({
        username: '',
        email: '',
        password1: '',
        telnumber : '',
        addr : '',
        detailaddr : ''
    });
    // 검증 메시지 상태관리
    const [msg, setMsg] = useState({
        username: '',
        email: '',
        password1: '',
        telnumber : '',
        addr : '',
        detailaddr : ''
    });
    // 검증 완료 여부 상태관리
    const [validate, setValidate] = useState({
        username: false,
        email: false,
        password1: false,
        telnumber: false,
        addr : false,
        detailaddr : false
    });

      

    // 회원이름을 입력처리 하는 이벤트 핸들러
    const nameHandler = e => {
        // console.log(e.target.value);

        const nameRegex = /^[가-힣]{2,8}$/;

        // 이름이 정확히 쓰여진 이름인가? - 검증
        let message; // 입력 상황 메시지
        if (!e.target.value) { // 유저네임을 안적음
            message = '유저이름은 필수값입니다.';
            setValidate({...validate, username: false})
        } else if (!nameRegex.test(e.target.value)) { // 이름은 2~8글자사이 한글로만
            message = '2글자에서 8글자 사이의 한글로 입력해주세요.';
            setValidate({...validate, username: false})
        } else {
            message = '사용 가능한 이름입니다.';
            setValidate({...validate, username: true})
        }

        // console.log(message);
        setMsg({...msg, username: message});
    
        setUser({ ...user, username: e.target.value })
    };

    // 패스워드 입력값 검증
    const passwordHandler = (e) => {

        const pwRegex =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

        let message;
        if (!e.target.value) {
            message = '비밀번호는 필수값입니다!';
            setValidate({...validate, password1: false});
        } else if (!pwRegex.test(e.target.value)) {
            message = '8자리 이상의 특수문자, 숫자를 포함해주세요!';
            setValidate({...validate, password1: false});
        } else {
            message = '사용할 수 있는 비밀번호입니다!';
            setValidate({...validate, password1: true});
        }
        setMsg({...msg, password1: message});

        setUser({...user, password1: e.target.value});

    };

    
    //전화번호 입력 검증
    const telnumberdHandler = (e) => {

        const tlRegex =  /(01[016789])-([1-9]{1}[0-9]{2,3})-([0-9]{4})$/;

        let message;
        if (!e.target.value) {
            message = '전화번호는 필수값입니다!';
            setValidate({...validate, telnumber: false});
        } else if (!tlRegex.test(e.target.value)) {
            message = 'xxx-xxxx-xxx(형태로 입력해주세요!)';
            setValidate({...validate, telnumber: false});
        } else {
            message = '사용할 수 있는 전화번호입니다.';
            setValidate({...validate, telnumber: true});
        }
        setMsg({...msg, telnumber: message});

        setUser({...user, telnumber: e.target.value});

    };

    // 이메일 중복확인 서버통신
    const checkEmail = (email) => {

        fetch(`${API_BASE_URL}/auth/check?email=${email}`)
            .then(res => res.json())
            .then(flag => {
                let message;
                if (flag) {
                    message = '중복된 이메일입니다.';
                    setValidate({...validate, email: false});
                } else {
                    message = '사용가능한 이메일입니다.';
                    setValidate({...validate, email: true});
                }
                setMsg({...msg, email: message});
            });
    };

    // 이메일 입력 검증
    const emailHandler = (e) => {
        const emailRegex = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/;

        let message;
        if (!e.target.value) {
            message = '이메일은 필수값입니다!';
            setValidate({...validate, email: false});
        } else if (!emailRegex.test(e.target.value)) {
            message = '이메일 형식이 아닙니다!';
            setValidate({...validate, email: false});
        } else {
            checkEmail(e.target.value);
        }
        setMsg({...msg, email: message});
        setUser({...user, email: e.target.value})
    };

    const addr = (e) => {


        let message;
        if (!e.target.value) {
            message = '전화번호는 주소입니다!';
            setValidate({...validate, addr: false});
        }  else {
            message = '사용할 수 있는 전화번호입니다.';
            setValidate({...validate, addr: true});
        }
        setMsg({...msg, addr: message});

        setUser({...user, addr: e.target.value});

    };

    const detailaddr = (e) => {

        let message;
        if (!e.target.value) {
            message = '전화번호는 주소입니다!';
            setValidate({...validate, detailaddr: false});
        }  else {
            message = '사용할 수 있는 전화번호입니다.';
            setValidate({...validate, detailaddr: true});
        }
        setMsg({...msg, detailaddr: message});

        setUser({...user, detailaddr: e.target.value});
    };



    // 상태변수 validate내부값이 모두 true인지 확인
    const isValid = () => {
        for (let key in validate) {
            if (!validate[key]) return false;            
        }
        return true;
    };

    useEffect(() => {
        if(!document.getElementById("test")) {
          const fileScript = document.createElement("script");
          fileScript.id = "test";
          fileScript.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
          document.body.appendChild(fileScript);
          
          fileScript.onload = () => {
            // do something
          };
          
          fileScript.onerror = () => {
            console.log("load error!");
          };
        }
      }, []);


      




            
            
      



    // 회원가입 처리 이벤트
    const joinHandler = e => {

        e.preventDefault();

        // 회원입력정보를 모두 읽어서 서버에 요청

        if(isValid()) { // validate값이 모두 true일 경우
            fetch(API_BASE_URL+'/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            }).then(res => {
                if (res.status === 200) {
                    alert('회원가입을 축하합니다!!');
                    window.location.href='/login';
                } else {
                    alert('서버에 문제가 생겼습니다. 다음에 다시 시도하세요 쏴리~');
                }
            })
        } else {
            alert('입력란을 다시 확인하세요!');
        }
    };


    	// 팝업창 상태 관리
        const [isPopupOpen, setIsPopupOpen] = useState(false)
 
        // 팝업창 열기
        const openPostCode = () => {
            setIsPopupOpen(true)
        }
     
        // 팝업창 닫기
        const closePostCode = () => {
            setIsPopupOpen(false)
        }



    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "180px" }}>
            <form noValidate onSubmit={joinHandler}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            계정 생성
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="fname"
                            name="username"
                            variant="outlined"
                            required
                            fullWidth
                            id="username"
                            label="유저 이름"
                            autoFocus
                            onChange={nameHandler}
                        />
                        <span style={validate.username ? {color:'green'} : {color:'red'}}>{msg.username}</span>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            onChange={emailHandler}
                        />
                        <span style={validate.email ? {color:'green'} : {color:'red'}}>{msg.email}</span>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="패스워드"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={passwordHandler}
                        />
                        <span style={validate.password ? {color:'green'} : {color:'red'}}>{msg.password}</span>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="telnumber"
                            label="전화번호"
                            type="tel"
                            id="telnumber"
                            autoComplete="telnumber"
                            onChange={telnumberdHandler}
                        />
                        <span style={validate.telnumber ? {color:'green'} : {color:'red'}}>{msg.telnumber}</span>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        label = "주소"
                        type="text"
                        fullWidth
                        required={true}
                         name="address" 
                         id="sample4_postcode"
                         onChange={addr}
                        />          
               <div>    
            <Button type='button' onClick={openPostCode}>우편번호 검색</Button>
            <div id='popupDom'>
                {isPopupOpen && (
                    <PopupDom>
                         <PopupPostCode onClose={closePostCode} />
                     </PopupDom>
                )}
            </div>  
            </div>   
                  </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="detailaddr"
                            label="상세주소"
                            type="detailaddr"
                            id="sample4_detailAddress"
                            onChange={detailaddr}
                            
                        />
                        <span style={validate.password ? {color:'green'} : {color:'red'}}>{msg.password}</span>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            계정 생성
                        </Button>
                    </Grid>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            이미 계정이 있습니까? 로그인 하세요.
                        </Link>
                    </Grid>
                </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Join;