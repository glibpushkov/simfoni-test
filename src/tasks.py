import os

from invoke import Collection, task
from invoke.util import cd

ns = Collection()


def directory_containing(filename):
    directory = os.getcwd()
    while True:
        if directory == '/':
            return None
        elif filename in os.listdir(directory):
            return directory
        else:
            directory = os.path.abspath(os.path.join(directory, '..'))


project_root = directory_containing('pytest.ini')


@task
def test(ctx, pylama=True):
    """
    Launch test suite
    """
    with cd(project_root):
        if pylama:
            ctx.run(
                "pytest"
                " --verbose"
                " --strict"
                " --pylama"
                # " --alluredir=../tests_artifacts/allure"
                " --cov=simfoni"
                " --cov-report term"
                " --cov-report html:cov_html"
                # " --cov-report xml:cov.xml"
                # " --cov-report annotate:cov_annotate"
                " simfoni/",
                pty=True, echo=True)
        else:
            ctx.run('pytest')


ns.add_task(test)

pip = Collection('pip')


@task()
def pipcompile(ctx):
    """
    Populate requirements.txt with exact versions of dependencies defined in requirements.in
    """
    with cd(project_root):
        ctx.run('pip-compile --upgrade requirements.in', pty=True, echo=True)


@task()
def pipsync(ctx):
    """
    Upgrade virtualenvironment to contain dependencies and versions
    exactly defined in requirements.txt
    """
    with cd(project_root):
        ctx.run('pip-sync requirements.txt', pty=True, echo=True)


@task()
def pipoutdated(ctx):
    """
    Print outdated packages. If there any it's time to use pip.compile and then pip.sync commands.
    """
    ctx.run('pip list -o')


pip.add_task(pipcompile, 'compile')
pip.add_task(pipsync, 'sync')
pip.add_task(pipoutdated, 'outdated')

ns.add_collection(pip)
