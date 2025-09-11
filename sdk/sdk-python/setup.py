from setuptools import setup, find_packages

setup(
    name="ans-project-sdk",
    version="0.0.4",
    author="gClouds R&D | gLabs",
    description="Python SDK for the Agent Network System (ANS)",
    long_description=open('README.md').read(),
    long_description_content_type="text/markdown",
    url="https://github.com/g-clouds/ANS/tree/main/sdk/sdk-python",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    install_requires=[
        "requests",
        "cryptography",
        "pydantic",
    ],
    keywords=["ans", "agent", "sdk", "cli", "lookup", "discovery", "ai-agent"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.7',
    include_package_data=True,
    entry_points={
        "console_scripts": [
            "anslookup = ans_project.sdk.cli:main",
        ],
    },
)
