import { async, inject, TestBed } from '@angular/core/testing';
import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { SnippetService } from './snippet.service';

describe('snippetservice ,(mockBackend)', () => {

  /*Initial configuration that will run before every testcase*/
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        SnippetService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  /*Testcase to check whether service is injected or not*/
  it('can instantiate service when inject service',
    inject([SnippetService], (service: SnippetService) => {
      expect(service instanceof SnippetService).toBe(true);
    }));

  /*Testcase to check whether mockdata is used instead of real database */
  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));

  /*Testcase to check whether instance of service is created or not*/
  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new SnippetService(http);
    expect(service instanceof SnippetService).toBe(true, 'new service should be ok');
  }));

  //Testcase for update snippet
  it('Snippet Should be updated',
    inject([SnippetService, XHRBackend], (SnippetService, mockBackend) => {
      const mockResponse = [
        { title: 'html', code: '<html></html>' },
        { title: 'css', code: '<head></head>' }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });
      SnippetService.updateSnippet().subscribe((snippet) => {
        expect(snippet[0].code).toEqual('<html></html>');
        expect(snippet[1].code).toEqual('<head></head>');
      });
    }));

  //Testcase for getsnippet method
  it('test getsnippet method',
    inject([SnippetService, XHRBackend], (SnippetService, mockBackend) => {
      const mockResponse = [{ title: 'html', code: '<title></title>' },
        { title: 'javascript', code: '<html></html>' },
      ];
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      SnippetService.getSnippet().subscribe((snippet) => {

        expect(snippet[1].title).toEqual('javascript');
      });
    }));

  //testcase for addsnippet method
  it('test addsnippet method',
    inject([SnippetService, XHRBackend], (SnippetService, mockBackend) => {

      const mockResponse = [{ title: 'html', code: '<title></title>' },
        { title: 'javascript', code: '<html></html>' },
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      SnippetService.addSnippet().subscribe((snippet) => {

        expect(snippet[1].title).toEqual('javascript');

      });
    }));
})
