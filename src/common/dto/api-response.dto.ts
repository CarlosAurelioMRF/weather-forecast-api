export class ApiResponseDto<TData = any> {
  success: boolean;
  message?: string;
  data?: TData;
}
