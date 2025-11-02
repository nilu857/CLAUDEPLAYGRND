/**
 * Request Builder for constructing API requests with fluent interface
 */
export class RequestBuilder {
  private headers: Record<string, string> = {};
  private queryParams: Record<string, any> = {};
  private bodyData: any = null;
  private formData: Record<string, any> = {};
  private authToken: string = '';

  /**
   * Add a header to the request
   */
  addHeader(key: string, value: string): RequestBuilder {
    this.headers[key] = value;
    return this;
  }

  /**
   * Add multiple headers to the request
   */
  addHeaders(headers: Record<string, string>): RequestBuilder {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Add query parameter to the request
   */
  addQueryParam(key: string, value: any): RequestBuilder {
    this.queryParams[key] = value;
    return this;
  }

  /**
   * Add multiple query parameters to the request
   */
  addQueryParams(params: Record<string, any>): RequestBuilder {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * Set request body
   */
  setBody(data: any): RequestBuilder {
    this.bodyData = data;
    return this;
  }

  /**
   * Set form data
   */
  setFormData(data: Record<string, any>): RequestBuilder {
    this.formData = data;
    return this;
  }

  /**
   * Set authorization token (Bearer)
   */
  setBearerToken(token: string): RequestBuilder {
    this.authToken = token;
    this.addHeader('Authorization', `Bearer ${token}`);
    return this;
  }

  /**
   * Set basic authentication
   */
  setBasicAuth(username: string, password: string): RequestBuilder {
    const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');
    this.addHeader('Authorization', `Basic ${encodedCredentials}`);
    return this;
  }

  /**
   * Build the request options object
   */
  build(): any {
    const options: any = {};

    if (Object.keys(this.headers).length > 0) {
      options.headers = this.headers;
    }

    if (Object.keys(this.queryParams).length > 0) {
      options.params = this.queryParams;
    }

    if (this.bodyData !== null) {
      options.data = this.bodyData;
    }

    if (Object.keys(this.formData).length > 0) {
      options.form = this.formData;
    }

    return options;
  }

  /**
   * Reset the builder to initial state
   */
  reset(): RequestBuilder {
    this.headers = {};
    this.queryParams = {};
    this.bodyData = null;
    this.formData = {};
    this.authToken = '';
    return this;
  }
}
