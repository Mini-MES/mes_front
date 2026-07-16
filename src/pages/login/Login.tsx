import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Factory, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { customFetch } from '@/api/fetcher';
import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LogoWrapper,
  LoginTitle,
  LoginSubtitle,
  LoginForm,
  InputGroup,
  InputField,
  ErrorText,
  SubmitBtn
} from './Login.styles';
import { LoadingSpinner } from '@/components/common/Spinner';

export default function Login() {
  const { login, isAuthenticated, userRole } = useApp();
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 로그인 성공 시 세션 복구 및 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin', {replace : true});
      } else {
        navigate('/worker', {replace : true});
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  // Auth 로그인 Mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { userID: string; password: string }) =>
      customFetch('/Auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    onSuccess: async() => {
      const success = await login();
      if (!success) {
        setErrorMessage('로그인에 실패했습니다.');
      }
    },
    onError: (error: any) => {
      setErrorMessage(error.message || 'ID 또는 비밀번호가 올바르지 않습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userID || !password) {
      setErrorMessage('ID와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    loginMutation.mutate({
      userID,
      password,
    });
  };

  if(isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LogoWrapper>
            <Factory size={48} />
          </LogoWrapper>
          <LoginTitle>ANTIGRAVITY MES</LoginTitle>
          <LoginSubtitle>실시간 생산 실행 및 공정 관리 시스템</LoginSubtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="userID">사용자 ID (UserID)</label>
            <InputField
              type="text"
              id="userID"
              placeholder="아이디를 입력하세요"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">비밀번호 (Password)</label>
            <InputField
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          {errorMessage && (
            <ErrorText>
              <AlertCircle size={14} />
              {errorMessage}
            </ErrorText>
          )}

          <SubmitBtn type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? '로그인 처리 중...' : '시스템 접속'}
          </SubmitBtn>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};
