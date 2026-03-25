import { AuthGuard, AuthenticatedRequest } from './auth.guard';
import { FirebaseService } from '../firebase/firebase.service';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let firebaseService: FirebaseService;

  beforeEach(() => {
    firebaseService = {
      getAuth: jest.fn().mockReturnValue({
        verifyIdToken: jest.fn(),
      }),
    } as unknown as FirebaseService;
    guard = new AuthGuard(firebaseService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no auth header', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if invalid auth header format', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Basic token' } }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true and set user if token is valid', async () => {
    const decodedToken = { uid: '123', email: 'test@test.com' };
    const verifyIdTokenMock = jest.fn().mockResolvedValue(decodedToken);
    (firebaseService.getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: verifyIdTokenMock,
    });

    const request = {
      headers: { authorization: 'Bearer valid-token' },
    } as AuthenticatedRequest;
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual({
      ...decodedToken,
    });
    expect(verifyIdTokenMock).toHaveBeenCalledWith('valid-token');
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    const verifyIdTokenMock = jest.fn().mockRejectedValue(new Error('Invalid'));
    (firebaseService.getAuth as jest.Mock).mockReturnValue({
      verifyIdToken: verifyIdTokenMock,
    });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
