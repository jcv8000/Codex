/* eslint-disable react/jsx-no-literals */
export function ExampleCode() {
    return (
        <pre className="lowlight">
            <code className="hljs cpp">
                <span className="hljs-meta">
                    #<span className="hljs-keyword">include</span>{" "}
                    <span className="hljs-string">&lt;iostream&gt;</span>
                </span>
                <br />
                <br />
                <span className="hljs-keyword">using</span>{" "}
                <span className="hljs-keyword">namespace</span> std;
                <br />
                <br />
                <span className="hljs-function">
                    <span className="hljs-type">int</span> <span className="hljs-title">main</span>
                    <span className="hljs-params">
                        (<span className="hljs-type">int</span> argc,{" "}
                        <span className="hljs-type">char</span>* argv[])
                    </span>{" "}
                </span>
                {"{"}
                <br />
                <br />
                <span className="hljs-comment">
                    {'    /* An annoying "Hello World" example */'}
                </span>
                <br />
                {"    "}cout &lt;&lt; <span className="hljs-string">{'"Hello, World!"'}</span>{" "}
                &lt;&lt; endl;
                <br />
                <br />
                {"}"}
            </code>
        </pre>
    );
}
